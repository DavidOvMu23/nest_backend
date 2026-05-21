import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import { CreateNotificacionDTO, UpdateNotificacionDTO } from './notificacion.dto';
import { Notificacion, EstadoNotificacion, TipoNotificacion } from './notificacion.entity';
import { Trabajador } from '../trabajador/trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';

@Injectable()
export class NotificacionService {
  private readonly logger = new Logger(NotificacionService.name);

  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
    @InjectRepository(Supervisor)
    private readonly supervisorRepository: Repository<Supervisor>,
  ) {}

  // ── CRUD básico ───────────────────────────────────────────────────────────────

  async create(dto: CreateNotificacionDTO): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create({
      titulo: dto.titulo,
      contenido: dto.contenido,
      estado: dto.estado ?? EstadoNotificacion.SIN_LEER,
      tipo: dto.tipo ?? TipoNotificacion.SUPERVISION,
      metadata: dto.metadata,
    });
    return this.notificacionRepository.save(notificacion);
  }

  async findAll(
    teleoperadorId?: number,
    estado?: EstadoNotificacion,
    tipo?: TipoNotificacion,
    search?: string,
    skip?: number,
    take?: number,
  ): Promise<{ data: Notificacion[]; total: number }> {
    const query = this.notificacionRepository.createQueryBuilder('notificacion');

    if (teleoperadorId) {
      query.andWhere('notificacion.teleoperadorId = :teleoperadorId', { teleoperadorId });
    }
    if (estado) {
      query.andWhere('notificacion.estado = :estado', { estado });
    }
    if (tipo) {
      query.andWhere('notificacion.tipo = :tipo', { tipo });
    }
    if (search) {
      query.andWhere(
        '(notificacion.contenido ILIKE :search OR notificacion.titulo ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    query.orderBy('notificacion.createdAt', 'DESC');
    if (skip !== undefined) query.skip(skip);
    if (take !== undefined) query.take(take);

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  async findOne(id: number): Promise<Notificacion | null> {
    return this.notificacionRepository.findOne({ where: { id_not: id } });
  }

  async update(id: number, dto: UpdateNotificacionDTO): Promise<Notificacion | null> {
    const notificacion = await this.notificacionRepository.findOne({ where: { id_not: id } });
    if (!notificacion) return null;

    if (dto.titulo !== undefined) notificacion.titulo = dto.titulo;
    if (dto.contenido !== undefined) notificacion.contenido = dto.contenido;
    if (dto.estado !== undefined) notificacion.estado = dto.estado;
    if (dto.tipo !== undefined) notificacion.tipo = dto.tipo;
    if (dto.metadata !== undefined) notificacion.metadata = dto.metadata;

    return this.notificacionRepository.save(notificacion);
  }

  async markAsRead(id: number): Promise<Notificacion | null> {
    return this.update(id, { estado: EstadoNotificacion.LEIDA });
  }

  async archive(id: number): Promise<Notificacion | null> {
    return this.update(id, { estado: EstadoNotificacion.ARCHIVADA });
  }

  async markAllAsRead(teleoperadorId: number): Promise<number> {
    const result = await this.notificacionRepository.update(
      { teleoperador: { id_trab: teleoperadorId }, estado: EstadoNotificacion.SIN_LEER } as FindOptionsWhere<Notificacion>,
      { estado: EstadoNotificacion.LEIDA },
    );
    return result.affected ?? 0;
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.notificacionRepository.delete({ id_not: id });
    return (result.affected ?? 0) > 0;
  }

  async removeArchived(teleoperadorId: number): Promise<number> {
    const result = await this.notificacionRepository.delete({
      teleoperador: { id_trab: teleoperadorId },
      estado: EstadoNotificacion.ARCHIVADA,
    } as FindOptionsWhere<Notificacion>);
    return result.affected ?? 0;
  }

  // ── Helpers para envío masivo ─────────────────────────────────────────────────

  /** Crea una notificación para un trabajador concreto (supervisor o teleoperador). */
  async createForUser(
    recipientId: number,
    titulo: string,
    contenido: string,
    tipo: TipoNotificacion,
    metadata?: Record<string, any>,
  ): Promise<void> {
    const recipient = await this.trabajadorRepository.findOne({ where: { id_trab: recipientId } });
    if (!recipient) return;

    const notif = this.notificacionRepository.create({
      titulo,
      contenido,
      tipo,
      estado: EstadoNotificacion.SIN_LEER,
      metadata,
      teleoperador: recipient,
    });
    await this.notificacionRepository.save(notif);
  }

  /** Notifica a todos los supervisores activos (excluye al actor si se proporciona). */
  async notifyAllSupervisors(
    titulo: string,
    contenido: string,
    tipo: TipoNotificacion,
    metadata?: Record<string, any>,
    excludeActorId?: number,
  ): Promise<void> {
    const supervisors = await this.supervisorRepository.find({
      where: { activo: true },
    });

    this.logger.log(`[notifyAllSupervisors] "${titulo}" — ${supervisors.length} supervisor(es) activo(s)`);

    const recipients = supervisors.filter(s => s.id_trab !== excludeActorId);
    if (recipients.length === 0) return;

    const notifications = recipients.map(s =>
      this.notificacionRepository.create({ titulo, contenido, tipo, estado: EstadoNotificacion.SIN_LEER, metadata, teleoperador: s }),
    );
    await this.notificacionRepository.save(notifications);
  }

  /** Notifica a todos los teleoperadores activos de un grupo (excluye al actor). */
  async notifyTeleoperadoresInGroup(
    grupoId: number,
    titulo: string,
    contenido: string,
    tipo: TipoNotificacion,
    metadata?: Record<string, any>,
    excludeActorId?: number,
  ): Promise<void> {
    const teleoperadores = await this.teleoperadorRepository.find({
      where: { grupo: { id_grup: grupoId }, activo: true },
    });

    const recipients = teleoperadores.filter(t => t.id_trab !== excludeActorId);
    if (recipients.length === 0) return;

    const notifications = recipients.map(t =>
      this.notificacionRepository.create({ titulo, contenido, tipo, estado: EstadoNotificacion.SIN_LEER, metadata, teleoperador: t }),
    );
    await this.notificacionRepository.save(notifications);
  }

  /** Resuelve el nombre completo de un trabajador dado su ID. */
  async resolveActorName(actorId: number): Promise<string> {
    const actor = await this.trabajadorRepository.findOne({ where: { id_trab: actorId } });
    return actor ? `${actor.nombre} ${actor.apellidos}` : 'Un supervisor';
  }
}
