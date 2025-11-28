import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeleoperadorService } from './teleoperador.service';
import { TeleoperadorController } from './teleoperador.controller';
import { Teleoperador } from './teleoperador.entity';

// Módulo de Teleoperador que importa la entidad, el servicio y el controlador.
@Module({
  imports: [TypeOrmModule.forFeature([Teleoperador])],
  providers: [TeleoperadorService],
  // controllers: [TeleoperadorController], // Comentado porque está vacío
})
export class TeleoperadorModule { }
