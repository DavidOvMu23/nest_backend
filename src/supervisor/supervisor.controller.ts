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
import { CreateSupervisorDTO, UpdateSupervisorDTO, SupervisorResponseDTO } from './supervisor.dto';
import { SupervisorService } from './supervisor.service';

/**
 * CONTROLADOR DE SUPERVISOR
 *
 * Abajo tienes un controlador con métodos CRUD básicos. Cada método tiene
 * comentarios "como si fueras nuevo" explicando paso a paso qué hace y por qué.
 */

@ApiTags('supervisors') // Esto sólo es para documentación (Swagger)
@Controller('supervisors') // Todas las rutas tendrán prefijo /supervisors
export class SupervisorController {
    // El servicio es donde realmente vive la lógica de negocio (BD, validaciones extra, etc).
    // Aquí sólo lo llamamos. Nest lo inyecta automáticamente.
    constructor(private readonly supervisorService: SupervisorService) { }

    // ====== CREAR ======
    @Post()
    @ApiOperation({ summary: 'Crear un supervisor' })
    @ApiBody({ type: CreateSupervisorDTO })
    @ApiResponse({ status: 201, description: 'Supervisor creado', type: SupervisorResponseDTO })
    async create(@Body() createDto: CreateSupervisorDTO) {
        // @Body(): toma el JSON que envía el cliente y lo convierte en createDto
        // La validación del DTO (regex de DNI, tipo string, etc.) debe ocurrir
        // antes de entrar aquí si tienes ValidationPipe activo.

        // Llamamos al servicio para crear el supervisor en la base de datos.
        // El servicio debería devolver el objeto creado.
        const created = await this.supervisorService.create(createDto);
        return created; // Se devuelve al cliente el supervisor creado
    }

    // ====== LISTAR TODOS ======
    @Get()
    @ApiOperation({ summary: 'Listar todos los supervisores' })
    @ApiResponse({ status: 200, description: 'Lista de supervisores', type: SupervisorResponseDTO, isArray: true })
    async findAll() {
        // Llamamos al servicio que obtiene todos los supervisores.
        // Aquí no hay body ni params; sólo devolvemos lo que venga del servicio.
        return this.supervisorService.findAll();
    }

    // ====== OBTENER UNO ======
    @Get(':id')
    @ApiOperation({ summary: 'Obtener supervisor por id' })
    @ApiResponse({ status: 200, description: 'Supervisor encontrado', type: SupervisorResponseDTO })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        // @Param('id', ParseIntPipe): toma el parametro de la ruta y lo convierte a number.
        // Si el cliente envía /supervisors/abc, ParseIntPipe lanza 400 (no es número).

        const found = await this.supervisorService.findOne(id);
        if (!found) {
            // Si no existe, lanzamos una excepción que Nest convierte a 404.
            throw new NotFoundException(`Supervisor con id ${id} no encontrado`);
        }
        return found; // Devolvemos el supervisor encontrado
    }

    // ====== ACTUALIZAR PARCIAL (PATCH) ======
    @Patch(':id')
    @ApiOperation({ summary: 'Actualizar supervisor (parcial)' })
    @ApiBody({ type: UpdateSupervisorDTO })
    @ApiResponse({ status: 200, description: 'Supervisor actualizado', type: SupervisorResponseDTO })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateSupervisorDTO,
    ) {
        // Se llama al servicio para actualizar. El servicio debe devolver el objeto
        // actualizado o null/undefined si no existe.
        const updated = await this.supervisorService.update(id, updateDto);
        if (!updated) {
            throw new NotFoundException(`Supervisor con id ${id} no encontrado`);
        }
        return updated; // Devolvemos el objeto actualizado
    }

    // ====== ELIMINAR ======
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT) // Si todo va bien, devolvemos 204 (sin cuerpo)
    @ApiOperation({ summary: 'Eliminar supervisor' })
    @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        // El servicio debe intentar borrar y devolver true/false o lanzar excepción.
        const removed = await this.supervisorService.remove(id);
        if (!removed) {
            // Si no se borró porque no existía, lanzamos 404
            throw new NotFoundException(`Supervisor con id ${id} no encontrado`);
        }
        // Como usamos HttpCode NO_CONTENT, aquí no devolvemos nada (204)
    }
}
