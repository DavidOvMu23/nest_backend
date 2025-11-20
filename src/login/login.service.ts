// src/login/login.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TrabajadorService } from '../trabajador/trabajador.service';
import * as bcrypt from 'bcrypt';

// Servicio de login que maneja la validación de usuarios y generación de tokens JWT
@Injectable()
export class LoginService {
  constructor(
    private readonly trabajadorService: TrabajadorService,
    private readonly jwtService: JwtService,
  ) {}

  // Valida las credenciales del usuario
  async validateUser(correo: string, contrasena: string): Promise<any> {
    const user = await this.trabajadorService.findByEmail(correo);
    if (!user) throw new UnauthorizedException('Usuario no encontrado');

    // compara contraseñas
    const isPasswordValid = await bcrypt.compare(contrasena, user.contrasena);
    if (!isPasswordValid)
      throw new UnauthorizedException('Contraseña incorrecta');

    return user;
  }

  // Genera un token JWT para el usuario autenticado
  async login(user: any) {
    const payload = { correo: user.correo, sub: user.id_trab, rol: user.rol };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
