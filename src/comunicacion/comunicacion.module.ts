import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ComunicacionService } from './comunicacion.service';
import { ComunicacionController } from './comunicacion.controller';
import { Comunicacion } from './comunicacion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comunicacion])],
  providers: [ComunicacionService],
  controllers: [ComunicacionController]
})
export class ComunicacionModule {}
