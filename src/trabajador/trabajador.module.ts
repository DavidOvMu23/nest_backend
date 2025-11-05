import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrabajadorService } from './trabajador.service';
import { TrabajadorController } from './trabajador.controller';
import { Trabajador } from './trabajador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trabajador])],
  providers: [TrabajadorService],
  controllers: [TrabajadorController]
})
export class TrabajadorModule {}
