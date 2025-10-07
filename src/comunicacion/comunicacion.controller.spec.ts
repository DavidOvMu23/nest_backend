import { Test, TestingModule } from '@nestjs/testing';
import { ComunicacionController } from './comunicacion.controller';

describe('ComunicacionController', () => {
  let controller: ComunicacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComunicacionController],
    }).compile();

    controller = module.get<ComunicacionController>(ComunicacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
