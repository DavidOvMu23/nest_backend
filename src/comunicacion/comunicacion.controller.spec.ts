import { Test, TestingModule } from '@nestjs/testing';
import { ComunicacionController } from './comunicacion.controller';

// Pruebas unitarias para el controlador de comunicación
describe('ComunicacionController', () => {
  let controller: ComunicacionController;

  // Configuración del módulo de pruebas antes de cada test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComunicacionController],
    }).compile();

    controller = module.get<ComunicacionController>(ComunicacionController);
  });

  // Test para verificar que el controlador está definido
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
