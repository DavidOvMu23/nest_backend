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
import { CreateTeleoperadorDTO, UpdateTeleoperadorDTO, TeleoperadorResponseDTO } from './teleoperador.dto';
import { TeleoperadorService } from './teleoperador.service';
import { Teleoperador } from './teleoperador.entity';


@ApiTags('teleoperador')
@Controller('teleoperador')
export class TeleoperadorController {
    constructor(private readonly teleoperadorService: TeleoperadorService) { }

    @Post()
    @ApiOperation({ summary: 'Crear un Teleoperador' })
    @ApiBody({ type: CreateTeleoperadorDTO })
    @ApiResponse({ status: 201, description: 'Teleoperador creado', type: TeleoperadorResponseDTO })
    async create(@Body() createDto: CreateTeleoperadorDTO) {
        const created = await this.teleoperadorService.create(createDto);
        return this.toResponse(created);
    }

    @Get()
    @ApiOperation({ summary: 'Listar todos los Teleoperadores' })
    @ApiResponse({ status: 200, description: 'Lista de teleoperadores', type: TeleoperadorResponseDTO, isArray: true })
    async findAll() {
        const teleoperador = await this.teleoperadorService.findAll();
        return teleoperador.map((item) => this.toResponse(item));
    }

    @Get(':id')
    @ApiOperation({ summary: 'Obtener teleoperador por id' })
    @ApiResponse({ status: 200, description: 'Supervisor encontrado', type: TeleoperadorResponseDTO })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const found = await this.teleoperadorService.findOne(id);
        if (!found) {
            throw new NotFoundException(`Teleoperador con id ${id} no encontrado`)
        }
        return this.toResponse(found)
    }


    @Patch(':id')
    @ApiOperation({ summary: 'Actualziar teleoperadores (parcial)' })
    @ApiBody({ type: UpdateTeleoperadorDTO })
    @ApiResponse({ status: 200, description: 'Teleoperador actualizado', type: TeleoperadorResponseDTO })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDto: UpdateTeleoperadorDTO
    ) {
        const updated = await this.teleoperadorService.update(id, updateDto);
        if (!updated) {
            throw new NotFoundException(`Teleoperador con id ${id} no encontrado`)
        }
        return this.toResponse(updated)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar teleoperador' })
    @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
    @ApiResponse({ status: 404, description: 'No encontrado' })
    async remove(@Param('id', ParseIntPipe) id: number) {
        const removed = await this.teleoperadorService.remove(id);
        if (!removed) {
            throw new NotFoundException(`Teleoperador con id ${id} no encontrado`)
        }
    }



    private toResponse(teleoperador: Teleoperador): TeleoperadorResponseDTO {
        const { id_trab, nombre, apellidos, correo, nia } = teleoperador;
        return {
            id_trab,
            nombre,
            apellidos,
            correo,
            nia
        };
    }
}