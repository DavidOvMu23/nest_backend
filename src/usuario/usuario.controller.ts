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
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  UsuarioResponseDTO,
} from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

// Controlador de Usuario que maneja las rutas y las solicitudes HTTP.
@ApiTags('usuario')
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  // ====== CREAR ======
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


  @Get('dni')
  @ApiOperation({ summary: 'Obtener un usuario por DNI' })
  @ApiResponse({ status: 200, type: UsuarioResponseDTO })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Body('dni') dni: string): Promise<Usuario> {
    const usuario = await this.usuarioService.findOne(dni);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  @Get()
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ status: 200, type: [UsuarioResponseDTO] })
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  @Patch('dni')
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  @ApiResponse({ status: 200, type: UsuarioResponseDTO })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Body('dni') dni: string,
    @Body() dto: UpdateUsuarioDTO,
  ): Promise<Usuario> {
    const result = await this.usuarioService.update(dni.toUpperCase(), dto);
    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return result;
  }


  //Eliminar un usuario
  @Delete('dni')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Body('dni') dni: string): Promise<void> {
    const removed = await this.usuarioService.remove(dni.toUpperCase());
    if (!removed) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
