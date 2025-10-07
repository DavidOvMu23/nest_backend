import { Module } from '@nestjs/common';
import { ComunicacionService } from './comunicacion.service';
import { ComunicacionController } from './comunicacion.controller';

@Module({
  providers: [ComunicacionService],
  controllers: [ComunicacionController]
})
export class ComunicacionModule {}
