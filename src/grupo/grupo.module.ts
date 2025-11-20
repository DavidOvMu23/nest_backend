import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { Grupo } from './grupo.entity';

// Módulo de Grupo que importa la entidad Grupo, el servicio y el controlador.
@Module({
  imports: [TypeOrmModule.forFeature([Grupo])],
  providers: [GrupoService],
  controllers: [GrupoController],
})
export class GrupoModule {}
