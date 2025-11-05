import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    NotFoundException,
    Param,
    Patch,
    Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
    CreateUsuarioDTO,
    UpdateUsuarioDTO,
    UsuarioResponseDTO,
} from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@ApiTags('usuario')
@Controller('usuario')
export class UsuarioController {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Post()
    @ApiOperation({ summary: 'Crear un nuevo usuario' })
    @ApiResponse({ status: 201, type: Usuario })
    async create(@Body() dto: CreateUsuarioDTO): Promise<Usuario> {
        const payload = {
            ...dto,
            dni: dto.dni.toUpperCase(),
        };
        return this.usuarioService.create(payload);
    }

    @Get()
    @ApiOperation({ summary: 'Listar usuarios' })
    @ApiResponse({ status: 200, type: [UsuarioResponseDTO] })
    async findAll(): Promise<Usuario[]> {
        return this.usuarioService.findAll();
    }

    @Get(':dni')
    @ApiOperation({ summary: 'Obtener un usuario por DNI' })
    @ApiResponse({ status: 200, type: UsuarioResponseDTO })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async findOne(@Param('dni') dni: string): Promise<Usuario> {
        const usuario = await this.usuarioService.findOne(dni.toUpperCase());
        if (!usuario) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return usuario;
    }

    @Patch(':dni')
    @ApiOperation({ summary: 'Actualizar datos de un usuario' })
    @ApiResponse({ status: 200, type: UsuarioResponseDTO })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async update(
        @Param('dni') dni: string,
        @Body() dto: UpdateUsuarioDTO,
    ): Promise<Usuario> {
        const result = await this.usuarioService.update(
            dni.toUpperCase(),
            dto,
        );
        if (!result) {
            throw new NotFoundException('Usuario no encontrado');
        }
        return result;
    }

    @Delete(':dni')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un usuario' })
    @ApiResponse({ status: 204 })
    @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
    async remove(@Param('dni') dni: string): Promise<void> {
        const removed = await this.usuarioService.remove(dni.toUpperCase());
        if (!removed) {
            throw new NotFoundException('Usuario no encontrado');
        }
    }
}
