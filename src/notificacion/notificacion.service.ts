import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateNotificacionDTO,
  UpdateNotificacionDTO,
} from './notificacion.dto';
import { Notificacion } from './notificacion.entity';

@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) {}

  async create(dto: CreateNotificacionDTO): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create({
      contenido: dto.contenido,
      estado: dto.estado,
    });

    return this.notificacionRepository.save(notificacion);
  }

  async findAll(): Promise<Notificacion[]> {
    return this.notificacionRepository.find();
  }

  async findOne(id: number): Promise<Notificacion | null> {
    return this.notificacionRepository.findOne({ where: { id_not: id } });
  }

  async update(
    id: number,
    dto: UpdateNotificacionDTO,
  ): Promise<Notificacion | null> {
    const notificacion = await this.notificacionRepository.findOne({
      where: { id_not: id },
    });
    if (!notificacion) {
      return null;
    }

    if (dto.contenido !== undefined) notificacion.contenido = dto.contenido;
    if (dto.estado !== undefined) notificacion.estado = dto.estado;
    return this.notificacionRepository.save(notificacion);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.notificacionRepository.delete({ id_not: id });
    const affected = result.affected ?? 0;
    return affected > 0;
  }
}
