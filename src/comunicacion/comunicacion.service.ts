import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateComunicacionDTO,
  UpdateComunicacionDTO,
} from './comunicacion.dto';
import { Comunicacion } from './comunicacion.entity';

@Injectable()
export class ComunicacionService {
  constructor(
    @InjectRepository(Comunicacion)
    private readonly comunicacionRepository: Repository<Comunicacion>,
  ) {}

  async create(dto: CreateComunicacionDTO): Promise<Comunicacion> {
    const comunicacion = this.comunicacionRepository.create({
      fecha: dto.fecha,
      hora: dto.hora,
      duracion: dto.duracion,
      resumen: dto.resumen,
      estado: dto.estado,
      observaciones: dto.observaciones,
    });

    return this.comunicacionRepository.save(comunicacion);
  }

  async findAll(): Promise<Comunicacion[]> {
    return this.comunicacionRepository.find();
  }

  async findOne(id: number): Promise<Comunicacion | null> {
    return this.comunicacionRepository.findOne({ where: { id_com: id } });
  }

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

    return this.comunicacionRepository.save(comunicacion);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.comunicacionRepository.delete({ id_com: id });
    const affected = result.affected ?? 0;
    return affected > 0;
  }
}
