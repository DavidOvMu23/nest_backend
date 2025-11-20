import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { Trabajador } from './trabajador.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { Supervisor } from '../supervisor/supervisor.entity';

// Módulo de Trabajador que importa las entidades, el servicio y el controlador.
@Module({
  imports: [TypeOrmModule.forFeature([Trabajador, Teleoperador, Supervisor])],
  providers: [TrabajadorService],
  controllers: [TrabajadorController],
})
export class TrabajadorModule {}
