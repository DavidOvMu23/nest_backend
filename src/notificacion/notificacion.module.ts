import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { Notificacion } from './notificacion.entity';
import { Trabajador } from '../trabajador/trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notificacion, Trabajador, Teleoperador, Supervisor])],
  providers: [NotificacionService],
  controllers: [NotificacionController],
  exports: [NotificacionService],
})
export class NotificacionModule {}
