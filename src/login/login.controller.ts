// src/login/login.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Login')
@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post()
  @ApiOperation({ summary: 'Iniciar sesión y obtener token JWT' })
  async login(@Body() body: { correo: string; contrasena: string }) {
    const user = await this.loginService.validateUser(
      body.correo,
      body.contrasena,
    );
    return this.loginService.login(user);
  }
}
