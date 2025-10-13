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
@Module({
  imports: [TrabajadorModule, TeleoperadorModule, SupervisorModule, GrupoModule, NotificacionModule, ComunicacionModule, UsuarioModule,
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: process.env.DB_HOST,
      port: 3306,
      username: 'cuidemjunts_user',
      password: 'elnegroeselimpostor',
      database: 'cuidemjunts_db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: false,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],


})
export class AppModule { }
