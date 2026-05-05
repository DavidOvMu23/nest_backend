import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
  Get,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from './guard/auth.guard';

@ApiTags('auth') // Agrupa en Swagger
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({
    summary: 'Login con correo y contraseña',
    description: `
      Obtén un token JWT para autenticarte en endpoints protegidos.
      
      **Usuarios de prueba disponibles:**
      
      **SUPERVISORES:**
      - Correo: sofia.martin@cuidem.local
      - Contraseña: temporal123
      
      - Correo: javier.rovira@cuidem.local
      - Contraseña: temporal123
      
      **TELEOPERADORES:**
      - Correo: laura.gomez@cuidem.local
      - Correo: carlos.navas@cuidem.local
      - Correo: noa.benitez@cuidem.local
      - Correo: pablo.rey@cuidem.local
      - Contraseña (todos): temporal123
      
      **Luego usa el token:**
      1. Copia el "token" de la respuesta
      2. En Swagger, presiona el botón verde "Authorize" (arriba a la derecha)
      3. En el campo, escribe: Bearer <el-token-copiado>
      4. Los endpoints protegidos ya funcionarán
    `,
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      supervisor: {
        value: {
          correo: 'sofia.martin@cuidem.local',
          contrasena: 'temporal123',
        },
      },
      teleoperador: {
        value: {
          correo: 'laura.gomez@cuidem.local',
          contrasena: 'temporal123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso - Devuelve el token JWT',
    schema: {
      example: {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        trabajador: {
          id: 1,
          nombre: 'Sofía',
          apellidos: 'Martín Prado',
          correo: 'sofia.martin@cuidem.local',
          rol: 'supervisor',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciales inválidas',
  })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth() // Indica que este endpoint requiere Bearer token
  @ApiOperation({
    summary: 'Obtener perfil del usuario autenticado',
    description: 'Requiere token JWT válido en Authorization header',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos del usuario autenticado',
  })
  @ApiResponse({
    status: 401,
    description: 'No autorizado - Token faltante o inválido',
  })
  getProfile(@Request() req: any): any {
    return req.user;
  }
}
