import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificacionService } from './notificacion.service';
import { NotificacionController } from './notificacion.controller';
import { Notificacion } from './notificacion.entity';

// Módulo de Notificacion que importa la entidad, el servicio y el controlador.
@Module({
  imports: [TypeOrmModule.forFeature([Notificacion])],
  providers: [NotificacionService],
  controllers: [NotificacionController],
})
export class NotificacionModule {}
