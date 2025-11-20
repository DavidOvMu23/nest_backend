import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoEmergenciaController } from './contacto_emergencia.controller';
import { ContactoEmergenciaService } from './contacto_emergencia.service';
import { ContactoEmergencia } from './contacto_emergencia.entity';

// Módulo para el contacto de emergencia
@Module({
  imports: [TypeOrmModule.forFeature([ContactoEmergencia])],
  controllers: [ContactoEmergenciaController],
  providers: [ContactoEmergenciaService],
})
export class ContactoEmergenciaModule {}
