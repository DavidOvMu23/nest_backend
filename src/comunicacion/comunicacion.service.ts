import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateComunicacionDTO,
  UpdateComunicacionDTO,
} from './comunicacion.dto';
import { Comunicacion } from './comunicacion.entity';
import { Grupo } from '../grupo/grupo.entity';
import { Usuario } from '../usuario/usuario.entity';
import { BadRequestException } from '@nestjs/common';

// Servicio para gestionar las comunicaciones
@Injectable()
export class ComunicacionService {
  constructor(
    @InjectRepository(Comunicacion)
    private readonly comunicacionRepository: Repository<Comunicacion>,
    @InjectRepository(Grupo)
    private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  // ====== MÉTODOS CRUD ======
  // Crear una nueva comunicación
  async create(dto: CreateComunicacionDTO): Promise<Comunicacion> {
    const comunicacion = this.comunicacionRepository.create({
      fecha: dto.fecha,
      hora: dto.hora,
      duracion: dto.duracion,
      resumen: dto.resumen,
      estado: dto.estado,
      observaciones: dto.observaciones,
    });

    // Asociar grupo si se proporciona
    if (dto.grupoId !== undefined && dto.grupoId !== null) {
      const grupo = await this.grupoRepository.findOne({
        where: { id_grup: dto.grupoId },
      });
      if (!grupo)
        throw new BadRequestException(
          `El grupo con ID ${dto.grupoId} no existe`,
        );
      comunicacion.grupo = grupo as any;
    }

    // Asociar usuario si se proporciona (usuarioId es DNI)
    if (dto.usuarioId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { dni: dto.usuarioId },
      });
      if (!usuario)
        throw new BadRequestException(
          `El usuario con DNI ${dto.usuarioId} no existe`,
        );
      comunicacion.usuario = usuario as any;
    }

    return this.comunicacionRepository.save(comunicacion);
  }

  // Obtener todas las comunicaciones
  async findAll(): Promise<Comunicacion[]> {
    // Cargamos las relaciones 'grupo' y 'usuario' para que las llamadas incluyan el grupo y el usuario.
    return this.comunicacionRepository.find({
      relations: {
        grupo: true,
        usuario: true,
      },
    });
  }

  // Obtener una comunicación por su ID
  async findOne(id: number): Promise<Comunicacion | null> {
    return this.comunicacionRepository.findOne({
      where: { id_com: id },
      relations: { grupo: true, usuario: true },
    });
  }

  // Actualizar una comunicación existente
  async update(
    id: number,
    dto: UpdateComunicacionDTO,
  ): Promise<Comunicacion | null> {
    const comunicacion = await this.comunicacionRepository.findOne({
      where: { id_com: id },
    });
    if (!comunicacion) {
      return null;
    }

    if (dto.fecha !== undefined) comunicacion.fecha = dto.fecha;
    if (dto.hora !== undefined) comunicacion.hora = dto.hora;
    if (dto.duracion !== undefined) comunicacion.duracion = dto.duracion;
    if (dto.resumen !== undefined) comunicacion.resumen = dto.resumen;
    if (dto.estado !== undefined) comunicacion.estado = dto.estado;
    if (dto.observaciones !== undefined)
      comunicacion.observaciones = dto.observaciones;

    // Asociar/actualizar grupo y usuario si vienen en el DTO
    if ((dto as any).grupoId !== undefined) {
      const gid = (dto as any).grupoId;
      if (gid === null) {
        comunicacion.grupo = null;
      } else {
        const grupo = await this.grupoRepository.findOne({
          where: { id_grup: gid },
        });
        if (!grupo)
          throw new BadRequestException(`El grupo con ID ${gid} no existe`);
        comunicacion.grupo = grupo as any;
      }
    }

    if ((dto as any).usuarioId !== undefined) {
      const uid = (dto as any).usuarioId;
      if (uid === null) {
        comunicacion.usuario = null as any;
      } else {
        const usuario = await this.usuarioRepository.findOne({
          where: { dni: uid },
        });
        if (!usuario)
          throw new BadRequestException(`El usuario con DNI ${uid} no existe`);
        comunicacion.usuario = usuario as any;
      }
    }

    return this.comunicacionRepository.save(comunicacion);
  }
}
