import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGrupoDTO, UpdateGrupoDTO } from './grupo.dto';
import { Grupo } from './grupo.entity';

// Servicio para la entidad Grupo que maneja la lógica de negocio.
@Injectable()
export class GrupoService {
  constructor(
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
  ) { }

  // Crear un nuevo Grupo
  async create(dto: CreateGrupoDTO): Promise<Grupo> {
    const existingGrupo = await this.grupoRepository.findOne({ where: { nombre: dto.nombre } });
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

  // Listar todos los Grupos activos
  async findAll(): Promise<Grupo[]> {
    return this.grupoRepository.find({ where: { activo: true } });
  }

  // Obtener un Grupo por su ID
  async findOne(id: number): Promise<Grupo | null> {
    return this.grupoRepository.findOne({ where: { id_grup: id } });
  }

  // Actualizar un Grupo existente
  async update(id: number, dto: UpdateGrupoDTO): Promise<Grupo | null> {
    const grupo = await this.grupoRepository.findOne({
      where: { id_grup: id },
    });
    if (!grupo) {
      return null;
    }

    if (dto.nombre !== undefined) grupo.nombre = dto.nombre;
    if (dto.descripcion !== undefined) grupo.descripcion = dto.descripcion;
    if (dto.activo !== undefined) grupo.activo = dto.activo;

    return this.grupoRepository.save(grupo);
  }

  // Eliminar (desactivar) un Grupo por su ID
  async remove(id: number): Promise<boolean> {
    const grupo = await this.grupoRepository.findOne({
      where: { id_grup: id },
    });
    if (!grupo) {
      return false;
    }

    // Soft delete: marcamos el registro como inactivo en lugar de borrarlo.
    grupo.activo = false;
    await this.grupoRepository.save(grupo);
    return true;
  }
}
