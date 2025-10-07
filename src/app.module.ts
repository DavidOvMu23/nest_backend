import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrabajadorModule } from './trabajador/trabajador.module';
import { TeleoperadorModule } from './teleoperador/teleoperador.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { GrupoModule } from './grupo/grupo.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { ComunicacionModule } from './comunicacion/comunicacion.module';
import { UsuarioModule } from './usuario/usuario.module';

@Module({
  imports: [TrabajadorModule, TeleoperadorModule, SupervisorModule, GrupoModule, NotificacionModule, ComunicacionModule, UsuarioModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
