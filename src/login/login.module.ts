import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { JwtStrategy } from './jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trabajador } from '../trabajador/trabajador.entity';
import { TrabajadorService } from '../trabajador/trabajador.service';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';

// Módulo de login que gestiona la autenticación
@Module({
  imports: [
    TypeOrmModule.forFeature([Trabajador, Teleoperador, Supervisor]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secreto-dev',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService, JwtStrategy, TrabajadorService],
  exports: [LoginService],
})
export class LoginModule {}
