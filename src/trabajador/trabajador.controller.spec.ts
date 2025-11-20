import { Test, TestingModule } from '@nestjs/testing';
import { TrabajadorController } from './trabajador.controller';

// Pruebas unitarias básicas para TrabajadorController.
describe('TrabajadorController', () => {
  let controller: TrabajadorController;

  // Antes de cada prueba se crea un módulo de testing con el controlador.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TrabajadorController],
    }).compile();

    controller = module.get<TrabajadorController>(TrabajadorController);
  });

  // Prueba básica para verificar que el controlador esté definido.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
