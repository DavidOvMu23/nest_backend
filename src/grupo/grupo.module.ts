import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { Grupo } from './grupo.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Teleoperador])],
  providers: [GrupoService],
  controllers: [GrupoController],
})
export class GrupoModule {}
