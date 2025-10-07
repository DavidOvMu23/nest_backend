import { Module } from '@nestjs/common';
import { GrupoService } from './grupo.service';
import { GrupoController } from './grupo.controller';

@Module({
  providers: [GrupoService],
  controllers: [GrupoController]
})
export class GrupoModule {}
