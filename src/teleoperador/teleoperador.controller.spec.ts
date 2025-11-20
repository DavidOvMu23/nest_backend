import { Test, TestingModule } from '@nestjs/testing';
import { TeleoperadorController } from './teleoperador.controller';

// Pruebas unitarias básicas para TeleoperadorController.
describe('TeleoperadorController', () => {
  let controller: TeleoperadorController;

  // Antes de cada prueba se crea un módulo de testing con el controlador.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeleoperadorController],
    }).compile();

    controller = module.get<TeleoperadorController>(TeleoperadorController);
  });

  // Prueba básica para verificar que el controlador esté definido.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
