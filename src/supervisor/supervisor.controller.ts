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
  CreateSupervisorDTO,
  UpdateSupervisorDTO,
  SupervisorResponseDTO,
} from './supervisor.dto';
import { SupervisorService } from './supervisor.service';
import { Supervisor } from './supervisor.entity';

/**
 * PIENSA EN EL CONTROLADOR COMO EN “la puerta de entrada”.
 * - Recibe la petición HTTP (POST/GET/…)
 * - Invoca al servicio adecuado
 * - Devuelve una respuesta amigable al cliente
 * Aquí solo hay orquestación, la lógica “pesada” vive en el servicio.
 */

@ApiTags('supervisor') // Etiqueta bonita para Swagger.
@Controller('supervisor') // Todas las rutas empiezan por /supervisors.
export class SupervisorController {
  // // Nest crea el servicio y nos lo entrega por el constructor.
  // constructor(private readonly supervisorService: SupervisorService) {}

  // // ====== CREAR ======
  // @Post()
  // @ApiOperation({ summary: 'Crear un supervisor' })
  // @ApiBody({ type: CreateSupervisorDTO })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Supervisor creado',
  //   type: SupervisorResponseDTO,
  // })
  // async create(@Body() createDto: CreateSupervisorDTO) {
  //   // @Body convierte el JSON del cliente en una instancia del DTO ya validada.
  //   const created = await this.supervisorService.create(createDto);
  //   // Convertimos la entidad a un DTO de salida para controlar qué campos mostramos.
  //   return this.toResponse(created);
  // }
  // // ====== OBTENER UNO ======
  // @Get('id')
  // @ApiOperation({ summary: 'Obtener supervisor por id' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Supervisor encontrado',
  //   type: SupervisorResponseDTO,
  // })
  // @ApiResponse({ status: 404, description: 'No encontrado' })
  // async findOne(@Body('id', ParseIntPipe) id: number): Promise<Supervisor> {
  //   // ParseIntPipe convierte el parámetro a number y lanza 400 si no puede.
  //   const found = await this.supervisorService.findOne(id);
  //   if (!found) {
  //     // Lanzamos 404 si el registro no existe.
  //     throw new NotFoundException(`Supervisor con id ${id} no encontrado`);
  //   }
  //   return found;
  // }

  // // ====== LISTAR TODOS ======
  // @Get()
  // @ApiOperation({ summary: 'Listar todos los supervisores' })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Lista de supervisores',
  //   type: SupervisorResponseDTO,
  //   isArray: true,
  // })
  // async findAll() {
  //   const supervisors = await this.supervisorService.findAll();
  //   return supervisors.map((item) => this.toResponse(item));
  // }

  // // ====== ACTUALIZAR PARCIAL (PATCH) ======
  // @Patch('id')
  // @ApiOperation({ summary: 'Actualizar supervisor (parcial)' })
  // @ApiBody({ type: UpdateSupervisorDTO })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Supervisor actualizado',
  //   type: SupervisorResponseDTO,
  // })
  // @ApiResponse({ status: 404, description: 'No encontrado' })
  // async update(
  //   @Body('id', ParseIntPipe) id: number,
  //   @Body() updateDto: UpdateSupervisorDTO,
  // ) {
  //   const updated = await this.supervisorService.update(id, updateDto);
  //   if (!updated) {
  //     throw new NotFoundException(`Supervisor con id ${id} no encontrado`);
  //   }
  //   return this.toResponse(updated);
  // }

  // // ====== ELIMINAR ======
  // @Delete('id')
  // @HttpCode(HttpStatus.NO_CONTENT) // HTTP 204 = se borró, no hace falta cuerpo de respuesta.
  // @ApiOperation({ summary: 'Eliminar supervisor' })
  // @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
  // @ApiResponse({ status: 404, description: 'No encontrado' })
  // async remove(@Body('id', ParseIntPipe) id: number): Promise<void> {
  //   const removed = await this.supervisorService.remove(id);
  //   if (!removed) {
  //     throw new NotFoundException(`Supervisor con id ${id} no encontrado`);
  //   }
  //   // No devolvemos nada porque el 204 indica “todo bien, sin contenido”.
  // }

  // /**
  //  * Función privada para centralizar cómo transformamos la entidad a DTO.
  //  * Así evitamos repetir lógica en cada método.
  //  */
  // private toResponse(supervisor: Supervisor): SupervisorResponseDTO {
  //   const { id_trab, nombre, apellidos, correo, dni } = supervisor;
  //   return {
  //     id_trab,
  //     nombre,
  //     apellidos,
  //     correo,
  //     dni,
  //   };
  // }
}
