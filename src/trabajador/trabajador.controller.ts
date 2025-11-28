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
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiResponseProperty,
} from '@nestjs/swagger';
import {
  CreateTrabajadorDTO,
  UpdateTrabajadorDTO,
  TrabajadorReponseDTO,
  LoginDTO,
} from './trabajador.dto';
import { TrabajadorService } from './trabajador.service';
import { Trabajador } from './trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import * as bcrypt from 'bcrypt';

// Controlador de Trabajador que maneja las rutas y las solicitudes HTTP.
@ApiTags('trabajador')
@Controller('trabajador')
export class TrabajadorController {
  constructor(private readonly trabajadorService: TrabajadorService) { }

  // ======= Crear ========
  @Post()
  @ApiOperation({
    summary: 'Crear un trabajador',
  })
  @ApiBody({
    type: CreateTrabajadorDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'Supervisor creado',
    type: TrabajadorReponseDTO,
  })
  async create(@Body() createDto: CreateTrabajadorDTO) {
    const created = await this.trabajadorService.create(createDto);
    return this.toResponse(created);
  }

  // ========== Obtener uno ==========
  @Get(':id')
  @ApiOperation({
    summary: 'Obtener trabajador por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado',
    type: TrabajadorReponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'No encontrado',
  })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Trabajador> {
    const found = await this.trabajadorService.findOne(id);
    if (!found) {
      throw new NotFoundException(`Trabajador con id ${id} no encontrado`);
    }
    return found;
  }

  // ======= Obtener todos ========
  @Get()
  @ApiOperation({
    summary: 'Listar todos los trabajadores',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de trabajadores',
    type: TrabajadorReponseDTO,
    isArray: true,
  })
  async findAll() {
    const trabajador = await this.trabajadorService.findAll();
    return trabajador.map((item) => this.toResponse(item));
  }

  // ======= Actualizar parcialmente=======
  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar trabajador (parcial)',
  })
  @ApiBody({
    type: UpdateTrabajadorDTO,
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador actualizado',
    type: TrabajadorReponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'No encontrado',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateTrabajadorDTO,
  ) {
    const update = await this.trabajadorService.update(id, updateDto);
    if (!update) {
      throw new NotFoundException(`Trabajador con id ${id} no encontrado`);
    }
    return this.toResponse(update);
  }

  // ====== Eliminar ======
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar trabajador',
  })
  @ApiResponse({
    status: 204,
    description: 'Eliminado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const removed = await this.trabajadorService.remove(id);
    if (!removed) {
      throw new NotFoundException(`Trabajador con id ${id} no encontrado`);
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
      response.grupoId = trabajador.grupo?.id_grup;
    }
    if (trabajador instanceof Supervisor) {
      response.dni = trabajador.dni;
    }
    return response;
  }

  @Post('login')
  @ApiOperation({
    summary: 'Obtener el Usuario por su correo',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajador encontrado',
    type: TrabajadorReponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'No encontrado',
  })
  async findOneEmail(
    @Body() loginDTO: LoginDTO
  ): Promise<Trabajador> {
    const user = await this.trabajadorService.findByEmail(loginDTO.correo);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    // compara contraseñas
    const isPasswordValid = await bcrypt.compare(loginDTO.contrasena, user.contrasena);
    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }
}
