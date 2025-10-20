import { Test, TestingModule } from '@nestjs/testing';
import { ContactoEmergenciaController } from './contacto_emergencia.controller';

describe('ContactoEmergenciaController', () => {
  let controller: ContactoEmergenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContactoEmergenciaController],
    }).compile();

    controller = module.get<ContactoEmergenciaController>(ContactoEmergenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
