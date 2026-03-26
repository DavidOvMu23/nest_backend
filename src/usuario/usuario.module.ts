import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './usuario.entity';
import { ContactoEmergencia } from '../contacto_emergencia/contacto_emergencia.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, ContactoEmergencia])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
})
export class UsuarioModule { }
