import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import {
  CreateNotificacionDTO,
  UpdateNotificacionDTO,
  NotificacionResponseDTO,
} from './notificacion.dto';
import { NotificacionService } from './notificacion.service';
import { Notificacion, EstadoNotificacion, TipoNotificacion } from './notificacion.entity';

@ApiTags('notificacion') // Etiqueta bonita para Swagger.
@Controller('notificacion')
export class NotificacionController {
  // Nest crea el servicio y nos lo entrega por el constructor.
  constructor(private readonly notificacionService: NotificacionService) { }

  // ====== CREAR ======
  @Post()
  @ApiOperation({ summary: 'Crear una notificacion' })
  @ApiBody({ type: CreateNotificacionDTO })
  @ApiResponse({
    status: 201,
    description: 'Notificacion creada',
    type: NotificacionResponseDTO,
  })
  async create(@Body() createDto: CreateNotificacionDTO) {
    const created = await this.notificacionService.create(createDto);
    return this.toResponse(created);
  }

  // ====== OBTENER UNA NOTIFICACIÓN ======
  @Get(':id')
  @ApiOperation({ summary: 'Obtener notificación por ID' })
  @ApiResponse({
    status: 200,
    description: 'Notificación encontrada',
    type: NotificacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const found = await this.notificacionService.findOne(id);
    if (!found) {
      throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    }
    return this.toResponse(found);
  }

  // ====== LISTAR NOTIFICACIONES CON FILTROS ======
  @Get()
  @ApiOperation({ summary: 'Listar notificaciones con filtros opcionales' })
  @ApiQuery({
    name: 'teleoperadorId',
    required: false,
    type: Number,
    description: 'Filtrar por ID del teleoperador',
  })
  @ApiQuery({
    name: 'estado',
    required: false,
    enum: EstadoNotificacion,
    description: 'Filtrar por estado',
  })
  @ApiQuery({
    name: 'tipo',
    required: false,
    enum: TipoNotificacion,
    description: 'Filtrar por tipo',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Buscar en contenido',
  })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Saltar N notificaciones',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Tomar N notificaciones',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/NotificacionResponseDTO' },
        },
        total: { type: 'number' },
      },
    },
  })
  async findAll(
    @Query('teleoperadorId', new ParseIntPipe({ optional: true })) teleoperadorId?: number,
    @Query('estado') estado?: EstadoNotificacion,
    @Query('tipo') tipo?: TipoNotificacion,
    @Query('search') search?: string,
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
  ) {
    return await this.notificacionService.findAll(
      teleoperadorId,
      estado,
      tipo,
      search,
      skip ?? 0,
      take ?? 20,
    );
  }

  // ====== ACTUALIZAR NOTIFICACIÓN ======
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar notificación' })
  @ApiBody({ type: UpdateNotificacionDTO })
  @ApiResponse({
    status: 200,
    description: 'Notificación actualizada',
    type: NotificacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateNotificacionDTO,
  ) {
    const updated = await this.notificacionService.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    }
    return this.toResponse(updated);
  }

  // ====== MARCAR COMO LEÍDA ======
  @Patch(':id/mark-read')
  @ApiOperation({ summary: 'Marcar notificación como leída' })
  @ApiResponse({
    status: 200,
    description: 'Notificación marcada como leída',
    type: NotificacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async markAsRead(@Param('id', ParseIntPipe) id: number) {
    const updated = await this.notificacionService.markAsRead(id);
    if (!updated) {
      throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    }
    return this.toResponse(updated);
  }

  // ====== ARCHIVAR NOTIFICACIÓN ======
  @Patch(':id/archive')
  @ApiOperation({ summary: 'Archivar notificación' })
  @ApiResponse({
    status: 200,
    description: 'Notificación archivada',
    type: NotificacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async archive(@Param('id', ParseIntPipe) id: number) {
    const updated = await this.notificacionService.archive(id);
    if (!updated) {
      throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    }
    return this.toResponse(updated);
  }

  // ====== MARCAR TODAS COMO LEÍDAS ======
  @Patch('user/:teleoperadorId/mark-all-read')
  @ApiOperation({ summary: 'Marcar todas las notificaciones como leídas para un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones marcadas como leídas',
    schema: { properties: { affected: { type: 'number' } } },
  })
  async markAllAsRead(@Param('teleoperadorId', ParseIntPipe) teleoperadorId: number) {
    const affected = await this.notificacionService.markAllAsRead(teleoperadorId);
    return { affected };
  }

  // ====== ELIMINAR NOTIFICACIÓN ======
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar notificación' })
  @ApiResponse({ status: 204, description: 'Eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const removed = await this.notificacionService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Notificación con id ${id} no encontrada`);
    }
  }

  // ====== LIMPIAR NOTIFICACIONES ARCHIVADAS ======
  @Delete('user/:teleoperadorId/archived')
  @ApiOperation({ summary: 'Eliminar todas las notificaciones archivadas de un usuario' })
  @ApiResponse({
    status: 200,
    description: 'Notificaciones archivadas eliminadas',
    schema: { properties: { affected: { type: 'number' } } },
  })
  async removeArchived(@Param('teleoperadorId', ParseIntPipe) teleoperadorId: number) {
    const affected = await this.notificacionService.removeArchived(teleoperadorId);
    return { affected };
  }

  /**
   * Función privada para centralizar cómo transformamos la entidad a DTO.
   * Así evitamos repetir lógica en cada método.
   */
  private toResponse(notificacion: Notificacion): NotificacionResponseDTO {
    return {
      id_not: notificacion.id_not,
      contenido: notificacion.contenido,
      estado: notificacion.estado,
      tipo: notificacion.tipo,
      metadata: notificacion.metadata,
      createdAt: notificacion.createdAt,
      updatedAt: notificacion.updatedAt,
    };
  }
}
