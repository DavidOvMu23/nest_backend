import { Test, TestingModule } from '@nestjs/testing';
import { TeleoperadorController } from './teleoperador.controller';

describe('TeleoperadorController', () => {
  let controller: TeleoperadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeleoperadorController],
    }).compile();

    controller = module.get<TeleoperadorController>(TeleoperadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
