import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';
import { Grupo } from './grupo.entity';
import { Teleoperador } from '../teleoperador/teleoperador.entity';
import { NotificacionModule } from '../notificacion/notificacion.module';

@Module({
  imports: [TypeOrmModule.forFeature([Grupo, Teleoperador]), NotificacionModule],
  providers: [GrupoService],
  controllers: [GrupoController],
})
export class GrupoModule {}
