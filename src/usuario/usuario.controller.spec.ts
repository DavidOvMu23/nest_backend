import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioController } from './usuario.controller';

// Pruebas unitarias básicas para UsuarioController.
describe('UsuarioController', () => {
  let controller: UsuarioController;

  // Antes de cada prueba se crea un módulo de testing con el controlador.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioController],
    }).compile();

    controller = module.get<UsuarioController>(UsuarioController);
  });

  // Prueba básica para verificar que el controlador esté definido.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
