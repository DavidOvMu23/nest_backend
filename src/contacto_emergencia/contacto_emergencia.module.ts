import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactoEmergenciaController } from './contacto_emergencia.controller';
import { ContactoEmergenciaService } from './contacto_emergencia.service';
import { ContactoEmergencia } from './contacto_emergencia.entity';
import { Usuario } from '../usuario/usuario.entity';

// Módulo para el contacto de emergencia
@Module({
  imports: [TypeOrmModule.forFeature([ContactoEmergencia, Usuario])],
  controllers: [ContactoEmergenciaController],
  providers: [ContactoEmergenciaService],
})
export class ContactoEmergenciaModule {}
