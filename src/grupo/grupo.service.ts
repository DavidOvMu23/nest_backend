import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrupoDTO, UpdateGrupoDTO } from './grupo.dto';
import { Grupo } from './grupo.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { NotificacionService } from '../notificacion/notificacion.service';
import { TipoNotificacion } from '../notificacion/notificacion.entity';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
    private readonly notificacionService: NotificacionService,
  ) {}

  async create(dto: CreateGrupoDTO, actorId?: number): Promise<Grupo> {
    const existingGrupo = await this.grupoRepository.findOne({ where: { nombre: dto.nombre } });
    if (existingGrupo) throw new ConflictException('El grupo con este nombre ya existe');

    const grupo = this.grupoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      activo: dto.activo,
    });
    const saved = await this.grupoRepository.save(grupo);

    const actorName = actorId ? await this.notificacionService.resolveActorName(actorId) : 'Un supervisor';
    await this.notificacionService.notifyAllSupervisors(
      'Nuevo grupo creado',
      `${actorName} ha creado el grupo: ${saved.nombre}`,
      TipoNotificacion.SUPERVISION,
      { eventType: 'GRUPO_CREADO', groupId: saved.id_grup, groupName: saved.nombre, actorId },
      actorId,
    );

    return saved;
  }

  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find({ relations: ['teleoperadores'] });
  }

  async findOne(id: number): Promise<Grupo | null> {
    return this.grupoRepository.findOne({ where: { id_grup: id }, relations: ['teleoperadores'] });
  }

  async update(id: number, dto: UpdateGrupoDTO, actorId?: number): Promise<Grupo | null> {
    const grupo = await this.grupoRepository.findOne({ where: { id_grup: id } });
    if (!grupo) return null;

    const estabaActivo = grupo.activo;

    if (dto.nombre !== undefined) grupo.nombre = dto.nombre;
    if (dto.descripcion !== undefined) grupo.descripcion = dto.descripcion;
    if (dto.activo !== undefined) grupo.activo = dto.activo;

    await this.grupoRepository.save(grupo);

    if (dto.activo === false && estabaActivo) {
      await this._desactivarTeleoperadoresDelGrupo(id);

      const actorName = actorId ? await this.notificacionService.resolveActorName(actorId) : 'Un supervisor';
      await this.notificacionService.notifyAllSupervisors(
        'Grupo desactivado',
        `${actorName} ha desactivado el grupo: ${grupo.nombre}`,
        TipoNotificacion.SUPERVISION,
        { eventType: 'GRUPO_DESACTIVADO', groupId: id, groupName: grupo.nombre, actorId },
        actorId,
      );
      await this.notificacionService.notifyTeleoperadoresInGroup(
        id,
        'Tu grupo ha sido desactivado',
        `El grupo ${grupo.nombre} al que perteneces ha sido desactivado`,
        TipoNotificacion.SYSTEM,
        { eventType: 'GRUPO_DESACTIVADO', groupId: id, groupName: grupo.nombre },
      );
    } else if (dto.activo === true && !estabaActivo) {
      const actorName = actorId ? await this.notificacionService.resolveActorName(actorId) : 'Un supervisor';
      await this.notificacionService.notifyAllSupervisors(
        'Grupo reactivado',
        `${actorName} ha reactivado el grupo: ${grupo.nombre}`,
        TipoNotificacion.SUPERVISION,
        { eventType: 'GRUPO_REACTIVADO', groupId: id, groupName: grupo.nombre, actorId },
        actorId,
      );
      await this.notificacionService.notifyTeleoperadoresInGroup(
        id,
        'Tu grupo ha sido reactivado',
        `El grupo ${grupo.nombre} al que perteneces ha sido reactivado`,
        TipoNotificacion.SYSTEM,
        { eventType: 'GRUPO_REACTIVADO', groupId: id, groupName: grupo.nombre },
      );
    }

    return this.grupoRepository.findOne({ where: { id_grup: id }, relations: ['teleoperadores'] });
  }

  async remove(id: number, actorId?: number): Promise<boolean> {
    const grupo = await this.grupoRepository.findOne({ where: { id_grup: id } });
    if (!grupo) return false;

    const actorName = actorId ? await this.notificacionService.resolveActorName(actorId) : 'Un supervisor';

    // Notificar a los teleoperadores antes de desactivarlos
    await this.notificacionService.notifyTeleoperadoresInGroup(
      id,
      'Tu grupo ha sido eliminado',
      `El grupo ${grupo.nombre} al que perteneces ha sido eliminado`,
      TipoNotificacion.SYSTEM,
      { eventType: 'GRUPO_ELIMINADO', groupId: id, groupName: grupo.nombre },
    );

    await this._desactivarTeleoperadoresDelGrupo(id);

    grupo.activo = false;
    await this.grupoRepository.save(grupo);

    await this.notificacionService.notifyAllSupervisors(
      'Grupo eliminado',
      `${actorName} ha eliminado el grupo: ${grupo.nombre}`,
      TipoNotificacion.SUPERVISION,
      { eventType: 'GRUPO_ELIMINADO', groupId: id, groupName: grupo.nombre, actorId },
      actorId,
    );

    return true;
  }

  private async _desactivarTeleoperadoresDelGrupo(grupoId: number): Promise<void> {
    const teleoperadores = await this.teleoperadorRepository.find({
      where: { grupo: { id_grup: grupoId } },
    });
    if (teleoperadores.length === 0) return;

    for (const tele of teleoperadores) {
      tele.activo = false;
    }
    await this.teleoperadorRepository.save(teleoperadores);
  }
}
