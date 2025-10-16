import { Inject, Module } from '@nestjs/common';
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
import { ConfigModule, ConfigService } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        console.log('PROCESS ENV DB_USER=', process.env.DB_USER);
        console.log('PROCESS ENV DB_PASSWORD present=', !!process.env.DB_PASSWORD);
        return {
          type: 'mysql',
          host: config.get<string>('DB_HOST'),
          port: Number(config.get<string>('DB_PORT') ?? 3306),
          username: config.get<string>('DB_USER'),
          password: config.get<string>('DB_PASSWORD'),
          database: config.get<string>('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: false,
        }
      },
      inject: [ConfigService],
    }),
    TrabajadorModule,
    TeleoperadorModule,
    SupervisorModule,
    GrupoModule,
    NotificacionModule,
    ComunicacionModule,
    UsuarioModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
