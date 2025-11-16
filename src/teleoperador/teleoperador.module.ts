import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeleoperadorService } from './teleoperador.service';
import { TeleoperadorController } from './teleoperador.controller';
import { Teleoperador } from './teleoperador.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teleoperador])],
  providers: [TeleoperadorService],
  controllers: [TeleoperadorController],
})
export class TeleoperadorModule {}
