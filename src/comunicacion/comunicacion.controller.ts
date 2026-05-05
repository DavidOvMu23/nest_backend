import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  UseGuards,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  CreateComunicacionDTO,
  UpdateComunicacionDTO,
  ComunicacionResponseDTO,
} from './comunicacion.dto';
import { ComunicacionService } from './comunicacion.service';
import { Comunicacion } from './comunicacion.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';

// Controlador para gestionar las comunicaciones (es lo que engloba llamadas, mensajes, etc.).
@ApiTags('comunicacion') // Etiqueta bonita para Swagger.
@ApiBearerAuth('access-token') // Requiere Bearer token en TODOS los endpoints
@Controller('comunicacion')
@UseGuards(AuthGuard, RolesGuard)
export class ComunicacionController {
  // Nest crea el servicio y nos lo entrega por el constructor.
  constructor(private readonly comunicationsService: ComunicacionService) { }

  // ====== CREAR ======
  @Post()
  @Roles('supervisor', 'teleoperador')
  @ApiOperation({ summary: 'Crear una comunicacion' })
  @ApiBody({ type: CreateComunicacionDTO })
  @ApiResponse({
    status: 201,
    description: 'Comunicacion creado',
    type: ComunicacionResponseDTO,
  })
  async create(@Body() createDto: CreateComunicacionDTO) {
    const created = await this.comunicationsService.create(createDto);
    return this.toResponse(created);
  }
  // ====== OBTENER UNO ======
  @Get(':id')
  @ApiOperation({ summary: 'Obtener comunicacion por id' })
  @ApiResponse({
    status: 200,
    description: 'Comunicacion encontrada',
    type: ComunicacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Comunicacion> {
    // ParseIntPipe convierte el parámetro a number y lanza 400 si no puede.
    const found = await this.comunicationsService.findOne(id);
    if (!found) {
      // Lanzamos 404 si el registro no existe.
      throw new NotFoundException(`Comunicacion con id ${id} no encontrada`);
    }
    return found;
  }
  // ====== LISTAR TODOS ======
  @Get()
  @Roles('supervisor', 'teleoperador')
  @ApiOperation({ summary: 'Listar todos las comunicaciones' })
  @ApiResponse({
    status: 200,
    description: 'Lista de comunicaciones',
    type: ComunicacionResponseDTO,
    isArray: true,
  })
  async findAll() {
    const comunications = await this.comunicationsService.findAll();
    return comunications.map((item) => this.toResponse(item));
  }

  // ====== ACTUALIZAR PARCIAL (PATCH) ======
  @Patch(':id')
  // Permitir que tanto supervisores como teleoperadores puedan actualizar comunicaciones.
  // Si prefieres que solo supervisores actualicen, revertir a @Roles('supervisor').
  @Roles('supervisor', 'teleoperador')
  @ApiOperation({ summary: 'Actualizar comuncacion (parcial)' })
  @ApiBody({ type: UpdateComunicacionDTO })
  @ApiResponse({
    status: 200,
    description: 'Comunicacion actualizado',
    type: ComunicacionResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateComunicacionDTO,
  ) {
    const updated = await this.comunicationsService.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Comunicacion con id ${id} no encontrada`);
    }
    return this.toResponse(updated);
  }

  // ====== ELIMINAR ======
  @Delete(':id')
  @Roles('supervisor', 'teleoperador')
  @ApiOperation({ summary: 'Eliminar comunicacion' })
  @ApiResponse({ status: 204, description: 'Comunicacion eliminada' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deleted = await this.comunicationsService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Comunicacion con id ${id} no encontrada`);
    }
    return;
  }

  /**
   * Función privada para centralizar cómo transformamos la entidad a DTO.
   * Así evitamos repetir lógica en cada método.
   */
  private toResponse(comunicacion: Comunicacion): ComunicacionResponseDTO {
    const {
      id_com,
      fecha,
      hora,
      duracion,
      resumen,
      estado,
      observaciones,
      grupo,
      usuario,
    } = comunicacion;

    return {
      id_com,
      fecha,
      hora,
      duracion,
      resumen,
      estado,
      observaciones,
      grupo: grupo
        ? {
          id_grup: grupo.id_grup,
          nombre: grupo.nombre,
          descripcion: grupo.descripcion,
          activo: grupo.activo,
        }
        : undefined,
      usuario: usuario
        ? {
          id_usu: usuario.dni,
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
        }
        : undefined,
    };
  }
}
