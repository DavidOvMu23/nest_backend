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
  CreateContactoEmergenciaDTO,
  UpdateContactoEmergenciaDTO,
  ContactoEmergenciaResponseDTO,
} from './contacto_emergencia.dto';
import { ContactoEmergenciaService } from './contacto_emergencia.service';
import { ContactoEmergencia } from './contacto_emergencia.entity';
import contacto_emergencia from 'src/data/contacto_emergencia';

@ApiTags('contacto_emergencia') // Etiqueta bonita para Swagger.
@Controller('contacto_emergencia')
export class ContactoEmergenciaController {
  // Nest crea el servicio y nos lo entrega por el constructor.
  constructor(
    private readonly contacto_emergenciaService: ContactoEmergenciaService,
  ) {}

  // ====== CREAR ======
  @Post()
  @ApiOperation({ summary: 'Crear un contacto de emergencia' })
  @ApiBody({ type: CreateContactoEmergenciaDTO })
  @ApiResponse({
    status: 201,
    description: 'Contacto de emergencia creado',
    type: ContactoEmergenciaResponseDTO,
  })
  async create(@Body() createDto: CreateContactoEmergenciaDTO) {
    const created = await this.contacto_emergenciaService.create(createDto);
    return this.toResponse(created);
  }

  // ====== OBTENER UNO ======
  @Get('id')
  @ApiOperation({ summary: 'Obtener contacto de emergencia por id' })
  @ApiResponse({
    status: 200,
    description: 'Contacto de emergencia encontrado',
    type: ContactoEmergenciaResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async findOne(
    @Body('id', ParseIntPipe) id: number,
  ): Promise<ContactoEmergencia> {
    // ParseIntPipe convierte el parámetro a number y lanza 400 si no puede.
    const found = await this.contacto_emergenciaService.findOne(id);
    if (!found) {
      // Lanzamos 404 si el registro no existe.
      throw new NotFoundException(
        `Contacto de emergencia con id ${id} no encontrada`,
      );
    }
    return found;
  }

  // ====== LISTAR TODOS ======
  @Get()
  @ApiOperation({ summary: 'Listar todos los contactos de emergencia' })
  @ApiResponse({
    status: 200,
    description: 'Lista los contactos de emergencia',
    type: ContactoEmergenciaResponseDTO,
    isArray: true,
  })
  async findAll() {
    const contacto_emergencia = await this.contacto_emergenciaService.findAll();
    return contacto_emergencia.map((item) => this.toResponse(item));
  }

  // ====== ACTUALIZAR PARCIAL (PATCH) ======
  @Patch('id')
  @ApiOperation({ summary: 'Actualizar contacto de emergencia (parcial)' })
  @ApiBody({ type: UpdateContactoEmergenciaDTO })
  @ApiResponse({
    status: 200,
    description: 'Contacto de emergencia actualizado',
    type: ContactoEmergenciaResponseDTO,
  })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async update(
    @Body('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateContactoEmergenciaDTO,
  ) {
    const updated = await this.contacto_emergenciaService.update(id, updateDto);
    if (!updated) {
      throw new NotFoundException(
        `Contacto de emergencia con id ${id} no encontrada`,
      );
    }
    return this.toResponse(updated);
  }

  // ====== ELIMINAR ======
  @Delete('id')
  @HttpCode(HttpStatus.NO_CONTENT) // HTTP 204 = se borró, no hace falta cuerpo de respuesta.
  @ApiOperation({ summary: 'Eliminar contacto de emergencia ' })
  @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No encontrado' })
  async remove(@Body('id', ParseIntPipe) id: number): Promise<void> {
    const removed = await this.contacto_emergenciaService.remove(id);
    if (!removed) {
      throw new NotFoundException(
        `Contacto de emergencia con id ${id} no encontrado`,
      );
    }
    // No devolvemos nada porque el 204 indica “todo bien, sin contenido”.
  }

  /**
   * Función privada para centralizar cómo transformamos la entidad a DTO.
   * Así evitamos repetir lógica en cada método.
   */
  private toResponse(
    contacto_emergencia: ContactoEmergencia,
  ): ContactoEmergenciaResponseDTO {
    const { id_cont, nombre, apellidos, telefono, relacion } =
      contacto_emergencia;
    return {
      id_cont,
      nombre,
      apellidos,
      telefono,
      relacion,
    };
  }
}
