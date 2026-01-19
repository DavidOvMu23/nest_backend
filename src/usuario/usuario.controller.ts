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
  UseGuards
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  UsuarioResponseDTO,
} from './usuario.dto';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthGuard } from '../auth/guard/auth.guard';

// Controlador de Usuario que maneja las rutas y las solicitudes HTTP.
@ApiTags('usuario')
@Controller('usuario')
@UseGuards(AuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) { }

  // ====== CREAR ======
  @Post()
  @Roles('supervisor')
  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @ApiResponse({ status: 201, type: Usuario })
  async create(@Body() dto: CreateUsuarioDTO): Promise<Usuario> {
    const payload = {
      ...dto,
      dni: dto.dni.toUpperCase(),
    };
    return this.usuarioService.create(payload);
  }

  // ====== OBTENER UNO ======
  @Get(':dni')
  @Roles('supervisor', 'teleoperador')
  @ApiOperation({ summary: 'Obtener un usuario por DNI' })
  @ApiResponse({ status: 200, type: UsuarioResponseDTO })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async findOne(@Param('dni') dni: string): Promise<Usuario> {
    const usuario = await this.usuarioService.findOne(dni);
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return usuario;
  }

  // ====== LISTAR TODOS ======

  @Get()
  @Roles('supervisor', 'teleoperador')
  @ApiOperation({ summary: 'Listar usuarios' })
  @ApiResponse({ status: 200, type: [UsuarioResponseDTO] })
  async findAll(): Promise<Usuario[]> {
    return this.usuarioService.findAll();
  }

  // ====== ACTUALIZAR ======

  @Patch(':dni')
  @Roles('supervisor')
  @ApiOperation({ summary: 'Actualizar datos de un usuario' })
  @ApiResponse({ status: 200, type: UsuarioResponseDTO })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async update(
    @Param('dni') dni: string,
    @Body() dto: UpdateUsuarioDTO,
  ): Promise<Usuario> {
    const result = await this.usuarioService.update(dni.toUpperCase(), dto);
    if (!result) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return result;
  }


  // ====== ELIMINAR ======
  @Delete(':dni')
  @Roles('supervisor')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un usuario' })
  @ApiResponse({ status: 204, description: 'Eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado' })
  async remove(@Param('dni') dni: string): Promise<void> {
    const removed = await this.usuarioService.remove(dni.toUpperCase());
    if (!removed) {
      throw new NotFoundException('Usuario no encontrado');
    }
  }
}
