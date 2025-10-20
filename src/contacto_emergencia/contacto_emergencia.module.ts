import { Module } from '@nestjs/common';
import { ContactoEmergenciaController } from './contacto_emergencia.controller';
import { ContactoEmergenciaService } from './contacto_emergencia.service';

@Module({
  controllers: [ContactoEmergenciaController],
  providers: [ContactoEmergenciaService]
})
export class ContactoEmergenciaModule {}
