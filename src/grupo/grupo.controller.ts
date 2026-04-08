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
import { CreateGrupoDTO, UpdateGrupoDTO, GrupoResponseDTO } from './grupo.dto';
import { GrupoService } from './grupo.service';
import { Grupo } from './grupo.entity';

// Controlador REST para la entidad Grupo.
@ApiTags('grupo') // Etiqueta bonita para Swagger.
@Controller('grupo')
export class GrupoController {
  // Nest crea el servicio y nos lo entrega por el constructor.
  constructor(private readonly gruposService: GrupoService) {}

  // ====== CREAR ======
  @Post()
  @ApiOperation({ summary: 'Crear un grupo' })
  @ApiBody({ type: CreateGrupoDTO })
  @ApiResponse({
    status: 201,
    description: 'Grupo creado',
    type: GrupoResponseDTO,
  })
  async create(@Body() createDto: CreateGrupoDTO) {
    const created = await this.gruposService.create(createDto);
    return this.toResponse(created);
  }

  // ====== OBTENER UNO ======
  @Get(':id')
  @ApiOperation({ summary: 'Obtener grupo por id' })
  @ApiResponse({
    status: 200,
    description: 'Grupo encontrado',
    type: GrupoResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Grupo> {
    // ParseIntPipe convierte el parámetro a number y lanza 400 si no puede.
    const found = await this.gruposService.findOne(id);
    if (!found) {
      // Lanzamos 404 si el registro no existe.
      throw new NotFoundException(`Grupo con id ${id} no encontrado`);
    }
    return found;
  }

  // ====== LISTAR TODOS ======
  @Get()
  @ApiOperation({ summary: 'Listar todos los grupos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de grupos',
    type: GrupoResponseDTO,
    isArray: true,
  })
  async findAll() {
    const grupos = await this.gruposService.findAll();
    return grupos.map((grupo) => this.toResponse(grupo));
  }

  // ====== ACTUALIZAR PARCIAL (PATCH) ======
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar grupo (parcial)' })
  @ApiBody({ type: UpdateGrupoDTO })
  @ApiResponse({
    status: 200,
    description: 'Grupo actualizado',
    type: GrupoResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateGrupoDTO,
  ) {
    const updated = await this.gruposService.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(`Grupo con id ${id} no encontrada`);
    }
    return this.toResponse(updated);
  }

  // ====== ELIMINAR ======
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // HTTP 204 = se borró, no hace falta cuerpo de respuesta.
  @ApiOperation({ summary: 'Eliminar grupo' })
  @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    const removed = await this.gruposService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Grupo con id ${id} no encontrado`);
    }
    // No devolvemos nada porque el 204 indica “todo bien, sin contenido”.
  }

  /**
   * Función privada para centralizar cómo transformamos la entidad a DTO.
   * Así evitamos repetir lógica en cada método.
   */
  private toResponse(grupo: Grupo): GrupoResponseDTO {
    const { id_grup, nombre, descripcion, activo } = grupo;
    return {
      id_grup,
      nombre,
      descripcion,
      activo,
    };
  }
}
