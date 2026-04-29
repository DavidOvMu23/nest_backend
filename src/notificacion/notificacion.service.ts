import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere } from 'typeorm';
import {
  CreateNotificacionDTO,
  UpdateNotificacionDTO,
} from './notificacion.dto';
import { Notificacion, EstadoNotificacion, TipoNotificacion } from './notificacion.entity';

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
      estado: dto.estado ?? EstadoNotificacion.SIN_LEER,
      tipo: dto.tipo ?? TipoNotificacion.OTRO,
      metadata: dto.metadata,
    });

    return this.notificacionRepository.save(notificacion);
  }

  // Obtener todas las notificaciones (opcionalmente filtradas)
  async findAll(
    teleoperadorId?: number,
    estado?: EstadoNotificacion,
    tipo?: TipoNotificacion,
    search?: string,
    skip?: number,
    take?: number,
  ): Promise<{ data: Notificacion[]; total: number }> {
    const query = this.notificacionRepository.createQueryBuilder('notificacion');

    // Filtrar por teleoperador (usuario actual)
    if (teleoperadorId) {
      query.andWhere('notificacion.teleoperadorId = :teleoperadorId', { teleoperadorId });
    }

    // Filtrar por estado
    if (estado) {
      query.andWhere('notificacion.estado = :estado', { estado });
    }

    // Filtrar por tipo
    if (tipo) {
      query.andWhere('notificacion.tipo = :tipo', { tipo });
    }

    // Búsqueda por contenido
    if (search) {
      query.andWhere('notificacion.contenido ILIKE :search', { search: `%${search}%` });
    }

    // Ordenar por fecha más reciente primero
    query.orderBy('notificacion.createdAt', 'DESC');

    // Paginación
    if (skip !== undefined) {
      query.skip(skip);
    }
    if (take !== undefined) {
      query.take(take);
    }

    const [data, total] = await query.getManyAndCount();
    return { data, total };
  }

  // Obtener una notificación por su ID.
  async findOne(id: number): Promise<Notificacion | null> {
    return this.notificacionRepository.findOne({ where: { id_not: id } });
  }

  // Actualizar una notificación
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

    if (dto.contenido !== undefined) {
      notificacion.contenido = dto.contenido;
    }
    if (dto.estado !== undefined) {
      notificacion.estado = dto.estado;
    }
    if (dto.tipo !== undefined) {
      notificacion.tipo = dto.tipo;
    }
    if (dto.metadata !== undefined) {
      notificacion.metadata = dto.metadata;
    }

    return this.notificacionRepository.save(notificacion);
  }

  // Marcar como leída
  async markAsRead(id: number): Promise<Notificacion | null> {
    return this.update(id, { estado: EstadoNotificacion.LEIDA });
  }

  // Archivar notificación
  async archive(id: number): Promise<Notificacion | null> {
    return this.update(id, { estado: EstadoNotificacion.ARCHIVADA });
  }

  // Marcar todas como leídas para un usuario
  async markAllAsRead(teleoperadorId: number): Promise<number> {
    const result = await this.notificacionRepository.update(
      {
        teleoperador: { id_teleop: teleoperadorId },
        estado: EstadoNotificacion.SIN_LEER,
      } as FindOptionsWhere<Notificacion>,
      { estado: EstadoNotificacion.LEIDA },
    );
    return result.affected ?? 0;
  }

  // Eliminar una notificación por su ID.
  async remove(id: number): Promise<boolean> {
    const result = await this.notificacionRepository.delete({ id_not: id });
    const affected = result.affected ?? 0;
    return affected > 0;
  }

  // Eliminar notificaciones archivadas (limpieza)
  async removeArchived(teleoperadorId: number): Promise<number> {
    const result = await this.notificacionRepository.delete({
      teleoperador: { id_teleop: teleoperadorId },
      estado: EstadoNotificacion.ARCHIVADA,
    } as FindOptionsWhere<Notificacion>);
    return result.affected ?? 0;
  }
}
