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
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiResponseProperty } from '@nestjs/swagger';
import { CreateTrabajadorDTO, UpdateTrabajadorDTO, TrabajadorReponseDTO } from './trabajador.dto';
import { TrabajadorService } from './trabajador.service';
import { Trabajador } from './trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';

@ApiTags('trabajador')
@Controller('trabajador')
export class TrabajadorController {
    constructor(private readonly trabajadorService: TrabajadorService) { }

    // ======= Crear ========
    @Post()
    @ApiOperation({
        summary: 'Crear un trabajador'
    })
    @ApiBody({
        type: CreateTrabajadorDTO
    })
    @ApiResponse({
        status: 201,
        description: 'Supervisor creado',
        type: TrabajadorReponseDTO
    })
    async create(@Body() createDto: CreateTrabajadorDTO) {
        const created = await this.trabajadorService.create(createDto);
        return this.toResponse(created);
    }

    // ========== Obtener uno ==========
    @Get('id')
    @ApiOperation({
        summary: 'Obtener trabajador por ID'
    })
    @ApiResponse({
        status: 200,
        description: 'Trabajador encontrado',
        type: TrabajadorReponseDTO
    })
    @ApiResponse({
        status: 404,
        description: 'No encontrado'
    })
    async findOne(@Body('id', ParseIntPipe) id: number): Promise<Trabajador> {
        const found = await this.trabajadorService.findOne(id);
        if (!found) {
            throw new NotFoundException(`Trabajador con id ${id} no encontrado`)
        }
        return found;
    }


    // ======= Obtener todos ========
    @Get()
    @ApiOperation({
        summary: 'Listar todos los trabajadores'
    })
    @ApiResponse({
        status: 200,
        description: 'Lista de trabajadores',
        type: TrabajadorReponseDTO,
        isArray: true
    })
    async findAll() {
        const trabajador = await this.trabajadorService.findAll();
        return trabajador.map((item) => this.toResponse(item));
    }





    // ======= Actualizar parcialmente=======
    @Patch(':id')
    @ApiOperation({
        summary: 'Actualizar trabajador (parcial)'
    })
    @ApiBody({
        type: UpdateTrabajadorDTO
    })
    @ApiResponse({
        status: 200,
        description: 'Trabajador actualizado',
        type: TrabajadorReponseDTO
    })
    @ApiResponse({
        status: 404, description: 'No encontrado'
    })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateTrabajadorDTO,
    ) {
        const update = await this.trabajadorService.update(id, updateDto);
        if (!update) {
            throw new NotFoundException(`Trabajador con id ${id} no encontrado`)
        }
        return this.toResponse(update)
    }


    // ====== Eliminar ======
    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Eliminar trabajador'
    })
    @ApiResponse({
        status: 204,
        description: 'Eliminado correctamente'
    })
    @ApiResponse({
        status: 404,
        description: 'No encontrado'
    })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const removed = await this.trabajadorService.remove(id);
        if (!removed) {
            throw new NotFoundException(`Trabajador con id ${id} no encontrado`)
        }
    }
    private toResponse(trabajador: Trabajador): TrabajadorReponseDTO {
        const { id_trab, nombre, apellidos, correo, rol } = trabajador;
        const response: TrabajadorReponseDTO = {
            id_trab,
            nombre,
            apellidos,
            correo,
            rol,
        };
        if (trabajador instanceof Teleoperador) {
            response.nia = trabajador.nia;
        }
        if (trabajador instanceof Supervisor) {
            response.dni = trabajador.dni;
        }
        return response;
    }

}
