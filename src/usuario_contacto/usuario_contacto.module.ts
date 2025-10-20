import { Module } from '@nestjs/common';
import { UsuarioContactoController } from './usuario_contacto.controller';
import { UsuarioContactoService } from './usuario_contacto.service';

@Module({
  controllers: [UsuarioContactoController],
  providers: [UsuarioContactoService]
})
export class UsuarioContactoModule {}
