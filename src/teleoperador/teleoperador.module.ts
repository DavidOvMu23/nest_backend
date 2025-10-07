import { Module } from '@nestjs/common';
import { TeleoperadorService } from './teleoperador.service';
import { TeleoperadorController } from './teleoperador.controller';

@Module({
  providers: [TeleoperadorService],
  controllers: [TeleoperadorController]
})
export class TeleoperadorModule {}
