import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trabajador } from '../trabajador/trabajador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants/jwt.constant';

@Module({
  imports: [
    TypeOrmModule.forFeature([Trabajador, Supervisor, Teleoperador]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
