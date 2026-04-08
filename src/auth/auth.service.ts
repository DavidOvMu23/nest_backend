import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trabajador, TipoTrabajador } from '../trabajador/trabajador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(Trabajador)
    private readonly trabajadorRepository: Repository<Trabajador>,
    @InjectRepository(Supervisor)
    private readonly supervisorRepository: Repository<Supervisor>,
    @InjectRepository(Teleoperador)
    private readonly teleoperadorRepository: Repository<Teleoperador>,
  ) { }

  async login(loginDto: LoginDto) {
    const { correo, contrasena } = loginDto;

    // Buscar trabajador por correo (puede ser supervisor o teleoperador)
    const trabajador = await this.trabajadorRepository.findOne({
      where: { correo },
    });

    if (!trabajador) {
      throw new NotFoundException('Correo o contraseña incorrectos');
    }

    // Validar contraseña
    const isPasswordValid = await bcrypt.compare(
      contrasena,
      trabajador.contrasena,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Correo o contraseña incorrectos');
    }

    // Obtener datos adicionales según el tipo de trabajador
    const datosAdicionales: Record<string, string | number> = {};

    if (trabajador.rol === TipoTrabajador.SUPERVISOR) {
      const supervisor = await this.supervisorRepository.findOne({
        where: { correo },
      });
      if (supervisor) {
        datosAdicionales = { dni: supervisor.dni };
      }
    } else if (trabajador.rol === TipoTrabajador.TELEOPERADOR) {
      const teleoperador = await this.teleoperadorRepository.findOne({
        where: { correo },
        relations: ['grupo'],
      });
      if (teleoperador) {
        datosAdicionales = { nia: teleoperador.nia, grupoId: teleoperador.grupo?.id_grup };
      }
    }

    // Generar JWT con datos del trabajador
    const payload = {
      id: trabajador.id_trab,
      correo: trabajador.correo,
      nombre: trabajador.nombre,
      rol: trabajador.rol,
      ...datosAdicionales,
    };
    const token = this.jwtService.sign(payload);

    return {
      token,
      trabajador: {
        id: trabajador.id_trab,
        correo: trabajador.correo,
        nombre: trabajador.nombre,
        apellidos: trabajador.apellidos,
        rol: trabajador.rol,
        ...datosAdicionales,
      },
    };
  }
}
