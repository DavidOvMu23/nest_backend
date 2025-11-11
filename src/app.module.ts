import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ContactoEmergenciaModule } from './contacto_emergencia/contacto_emergencia.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ComunicacionModule } from './comunicacion/comunicacion.module';
import { GrupoModule } from './grupo/grupo.module';
import { NotificacionModule } from './notificacion/notificacion.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { TeleoperadorModule } from './teleoperador/teleoperador.module';
import { TrabajadorModule } from './trabajador/trabajador.module';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../env', '../../env'],
    }),

    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, //se usa solo para desarrollo y probar los datos de prueba del script,
      // Habrá que declararlo en true cuando ya metamos los datos reales de la app y que typeORM
      // gestione la estructura sin el script de SQL manual, habrá que borrar el script de sql y
      // declarar el syncronize en tru
    }),
    UsuarioModule,
    ComunicacionModule,
    ContactoEmergenciaModule,
    GrupoModule,
    NotificacionModule,
    SupervisorModule,
    TeleoperadorModule,
    TrabajadorModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
