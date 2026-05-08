import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrupoDTO, UpdateGrupoDTO } from './grupo.dto';
import { Grupo } from './grupo.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';

@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
  ) {}

  async create(dto: CreateGrupoDTO): Promise<Grupo> {
    const existingGrupo = await this.grupoRepository.findOne({
      where: { nombre: dto.nombre },
    });
    if (existingGrupo) {
      throw new ConflictException('El grupo con este nombre ya existe');
    }

    const grupo = this.grupoRepository.create({
      nombre: dto.nombre,
      descripcion: dto.descripcion,
      activo: dto.activo,
    });

    return this.grupoRepository.save(grupo);
  }

  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find({ relations: ['teleoperadores'] });
  }

  async findOne(id: number): Promise<Grupo | null> {
    return this.grupoRepository.findOne({
      where: { id_grup: id },
      relations: ['teleoperadores'],
    });
  }

  async update(id: number, dto: UpdateGrupoDTO): Promise<Grupo | null> {
    const grupo = await this.grupoRepository.findOne({
      where: { id_grup: id },
    });
    if (!grupo) {
      return null;
    }

    const estabaActivo = grupo.activo;

    if (dto.nombre !== undefined) grupo.nombre = dto.nombre;
    if (dto.descripcion !== undefined) grupo.descripcion = dto.descripcion;
    if (dto.activo !== undefined) grupo.activo = dto.activo;

    await this.grupoRepository.save(grupo);

    // Si se acaba de desactivar el grupo, desactivar también sus teleoperadores
    if (dto.activo === false && estabaActivo) {
      await this._desactivarTeleoperadoresDelGrupo(id);
    }

    return this.grupoRepository.findOne({
      where: { id_grup: id },
      relations: ['teleoperadores'],
    });
  }

  async remove(id: number): Promise<boolean> {
    const grupo = await this.grupoRepository.findOne({
      where: { id_grup: id },
    });
    if (!grupo) {
      return false;
    }

    await this._desactivarTeleoperadoresDelGrupo(id);

    grupo.activo = false;
    await this.grupoRepository.save(grupo);
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
