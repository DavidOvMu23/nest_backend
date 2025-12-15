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
import { AuthModule } from './auth/auth.module';

// Módulo principal de la aplicación que importa otros módulos, configura la conexión a la base de datos y define los controladores y proveedores globales
@Module({
  imports: [
    // Carga de variables de entorno desde archivos .env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../env', '../../env'],
    }),

    // Configuración de la conexión a la base de datos PostgreSQL usando TypeORM
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true, // solo para desarrollo
    }),
    UsuarioModule,
    ComunicacionModule,
    ContactoEmergenciaModule,
    GrupoModule,
    NotificacionModule,
    SupervisorModule,
    TeleoperadorModule,
    TrabajadorModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
