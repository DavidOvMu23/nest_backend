import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import {
  CreateNotificacionDTO,
  UpdateNotificacionDTO,
  NotificacionResponseDTO,
} from './notificacion.dto';
import { NotificacionService } from './notificacion.service';
import { Notificacion } from './notificacion.entity';

@ApiTags('comunications') // Etiqueta bonita para Swagger.
@Controller('comunications')
export class NotificacionController {
  // Nest crea el servicio y nos lo entrega por el constructor.
  constructor(private readonly comunicationsService: NotificacionService) {}

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
    const created = await this.comunicationsService.create(createDto);
    return this.toResponse(created);
  }

  // ====== LISTAR TODOS ======
  @Get()
  @ApiOperation({ summary: 'Listar todas las notificaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de notificaciones',
    type: NotificacionResponseDTO,
    isArray: true,
  })
  async findAll() {
    const comunications = await this.comunicationsService.findAll();
    return comunications.map((item) => this.toResponse(item));
  }

  // ====== OBTENER UNO ======
  @Get(':id')
  @ApiOperation({ summary: 'Obtener notificacion por id' })
  @ApiResponse({
    status: 200,
    description: 'Notificacion encontrada',
    type: NotificacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrada' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    // ParseIntPipe convierte el parámetro a number y lanza 400 si no puede.
    const found = await this.comunicationsService.findOne(id);
    if (!found) {
      // Lanzamos 404 si el registro no existe.
      throw new NotFoundException(`Notificacion con id ${id} no encontrada`);
    }
    return this.toResponse(found);
  }

  // ====== ACTUALIZAR PARCIAL (PATCH) ======
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar notificacion (parcial)' })
  @ApiBody({ type: UpdateNotificacionDTO })
  @ApiResponse({
    status: 200,
    description: 'Notificacion actualizada',
    type: NotificacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateNotificacionDTO,
  ) {
    const updated = await this.comunicationsService.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Notificacion con id ${id} no encontrada`);
    }
    return this.toResponse(updated);
  }

  // ====== ELIMINAR ======
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // HTTP 204 = se borró, no hace falta cuerpo de respuesta.
  @ApiOperation({ summary: 'Eliminar notificacion' })
  @ApiResponse({ status: 204, description: 'Eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removed = await this.comunicationsService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Notificacion con id ${id} no encontrada`);
    }
    // No devolvemos nada porque el 204 indica “todo bien, sin contenido”.
  }

  /**
   * Función privada para centralizar cómo transformamos la entidad a DTO.
   * Así evitamos repetir lógica en cada método.
   */
  private toResponse(notificacion: Notificacion): NotificacionResponseDTO {
    const { id_not, contenido, estado } = notificacion;
    return {
      id_not,
      contenido,
      estado,
    };
  }
}
