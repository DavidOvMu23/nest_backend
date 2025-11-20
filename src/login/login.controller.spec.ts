import { Test, TestingModule } from '@nestjs/testing';
import { LoginController } from './login.controller';

// Pruebas unitarias para LoginController
describe('LoginController', () => {
  let controller: LoginController;

  // Configuración del módulo de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoginController],
    }).compile();

    controller = module.get<LoginController>(LoginController);
  });

  // Verificación de que el controlador esté definido
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
