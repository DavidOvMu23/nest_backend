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
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // 👇 Cargar las variables de entorno
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // asegúrate de que tu .env esté en nest_backend/
    }),

    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity.{ts,js}'],
      synchronize: false,
      autoLoadEntities: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
