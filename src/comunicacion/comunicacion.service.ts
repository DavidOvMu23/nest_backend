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
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { BadRequestException } from '@nestjs/common';
import { NotificacionService } from '../notificacion/notificacion.service';
import { TipoNotificacion } from '../notificacion/notificacion.entity';

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
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
    private readonly notificacionService: NotificacionService,
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
      informacion_supervisor: dto.informacion_supervisor,
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

    // Asociar teleoperador si se proporciona
    if (dto.teleoperadorId !== undefined && dto.teleoperadorId !== null) {
      const teleoperador = await this.teleoperadorRepository.findOne({
        where: { id_trab: dto.teleoperadorId },
      });
      if (!teleoperador)
        throw new BadRequestException(
          `El teleoperador con ID ${dto.teleoperadorId} no existe`,
        );
      comunicacion.teleoperador = teleoperador;
    }

    const saved = await this.comunicacionRepository.save(comunicacion);

    // Notificar a supervisores siempre que se cree una llamada
    const grupo = saved.grupo as Grupo | undefined;
    const usuario = saved.usuario as Usuario | undefined;
    const grupoNombre = grupo?.nombre ?? 'desconocido';
    const usuarioNombre = usuario ? `${usuario.nombre} ${usuario.apellidos}` : 'desconocido';
    const estadoNorm = (saved.estado ?? '').toLowerCase();

    const tituloCreate =
      estadoNorm === 'completada'   ? 'Llamada completada' :
      estadoNorm === 'no_contesto'  ? 'Llamada sin respuesta' :
                                      'Nueva llamada registrada';

    const contenidoCreate =
      estadoNorm === 'completada'
        ? `El grupo ${grupoNombre} ha realizado una llamada con el usuario ${usuarioNombre}`
        : estadoNorm === 'no_contesto'
        ? `El grupo ${grupoNombre} no ha podido contactar con el usuario ${usuarioNombre}`
        : `El grupo ${grupoNombre} ha registrado una nueva llamada para el usuario ${usuarioNombre}`;

    await this.notificacionService.notifyAllSupervisors(
      tituloCreate,
      contenidoCreate,
      TipoNotificacion.CALL,
      { eventType: 'LLAMADA_REGISTRADA', callId: saved.id_com, grupoNombre, usuarioNombre, estado: estadoNorm },
    );

    // Solo notificar a los teleoperadores del grupo si la llamada es de hoy
    if (grupo) {
      const today = new Date();
      const fechaLlamada = saved.fecha instanceof Date ? saved.fecha : new Date(saved.fecha);
      const esHoy =
        fechaLlamada.getFullYear() === today.getFullYear() &&
        fechaLlamada.getMonth() === today.getMonth() &&
        fechaLlamada.getDate() === today.getDate();

      if (esHoy) {
        await this.notificacionService.notifyTeleoperadoresInGroup(
          grupo.id_grup,
          'Nueva llamada hoy en tu grupo',
          `Nueva llamada hoy para tu grupo ${grupoNombre}: usuario ${usuarioNombre} a las ${saved.hora ?? ''}`,
          TipoNotificacion.CALL,
          { eventType: 'LLAMADA_HOY', callId: saved.id_com, grupoNombre, usuarioNombre },
        );
      }
    }

    return saved;
  }

  // Obtener todas las comunicaciones
  async findAll(): Promise<Comunicacion[]> {
    return this.comunicacionRepository.find({
      relations: {
        grupo: true,
        usuario: true,
        teleoperador: true,
      },
    });
  }

  // Obtener una comunicación por su ID
  async findOne(id: number): Promise<Comunicacion | null> {
    return this.comunicacionRepository.findOne({
      where: { id_com: id },
      relations: { grupo: true, usuario: true, teleoperador: true },
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
    if (dto.informacion_supervisor !== undefined)
      comunicacion.informacion_supervisor = dto.informacion_supervisor;

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

    if ((dto as any).teleoperadorId !== undefined) {
      const tid = (dto as any).teleoperadorId;
      if (tid === null) {
        comunicacion.teleoperador = null;
      } else {
        const teleoperador = await this.teleoperadorRepository.findOne({
          where: { id_trab: tid },
        });
        if (!teleoperador)
          throw new BadRequestException(`El teleoperador con ID ${tid} no existe`);
        comunicacion.teleoperador = teleoperador;
      }
    }

    const saved = await this.comunicacionRepository.save(comunicacion);

    // Notificar a supervisores cuando el resultado editado es completada o no_contesto
    const estadoNorm = (saved.estado ?? '').toLowerCase();
    if (['completada', 'no_contesto'].includes(estadoNorm)) {
      const full = await this.comunicacionRepository.findOne({
        where: { id_com: saved.id_com },
        relations: { grupo: true, usuario: true },
      });
      const grupoNombre = (full?.grupo as Grupo | undefined)?.nombre ?? 'desconocido';
      const u = full?.usuario as Usuario | undefined;
      const usuarioNombre = u ? `${u.nombre} ${u.apellidos}` : 'desconocido';

      const titulo = estadoNorm === 'completada' ? 'Llamada completada' : 'Llamada sin respuesta';
      const contenidoSuper =
        estadoNorm === 'completada'
          ? `El grupo ${grupoNombre} ha realizado una llamada con el usuario ${usuarioNombre}`
          : `El grupo ${grupoNombre} no ha podido contactar con el usuario ${usuarioNombre}`;

      await this.notificacionService.notifyAllSupervisors(
        titulo,
        contenidoSuper,
        TipoNotificacion.CALL,
        { eventType: 'LLAMADA_EDITADA', callId: saved.id_com, grupoNombre, usuarioNombre, estado: estadoNorm },
      );
    }

    return saved;
  }

  // Eliminar una comunicación por su ID
  async delete(id: number): Promise<boolean> {
    const comunicacion = await this.comunicacionRepository.findOne({
      where: { id_com: id },
    });
    if (!comunicacion) {
      return false;
    }

    await this.comunicacionRepository.remove(comunicacion);
    return true;
  }
}
