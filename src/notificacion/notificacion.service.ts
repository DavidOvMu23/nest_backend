import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  CreateNotificacionDTO,
  UpdateNotificacionDTO,
} from './notificacion.dto';
import { Notificacion } from './notificacion.entity';

// Servicio de Notificacion que maneja la lógica de negocio.
@Injectable()
export class NotificacionService {
  constructor(
    @InjectRepository(Notificacion)
    private readonly notificacionRepository: Repository<Notificacion>,
  ) { }

  // Método para crear una nueva notificación.
  async create(dto: CreateNotificacionDTO): Promise<Notificacion> {
    const notificacion = this.notificacionRepository.create({
      contenido: dto.contenido,
      estado: dto.estado,
    });

    return this.notificacionRepository.save(notificacion);
  }

  // Método para obtener todas las notificaciones.
  async findAll(): Promise<Notificacion[]> {
    return this.notificacionRepository.find();
  }

  // Método para obtener una notificación por su ID.
  async findOne(id: number): Promise<Notificacion | null> {
    return this.notificacionRepository.findOne({ where: { id_not: id } });
  }


  // Método para eliminar una notificación por su ID.
  async remove(id: number): Promise<boolean> {
    const result = await this.notificacionRepository.delete({ id_not: id });
    const affected = result.affected ?? 0;
    return affected > 0;
  }
}
