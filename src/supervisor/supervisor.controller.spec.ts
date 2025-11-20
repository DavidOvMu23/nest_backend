import { Test, TestingModule } from '@nestjs/testing';
import { SupervisorController } from './supervisor.controller';

// esto contiene pruebas unitarias básicas para SupervisorController.
describe('SupervisorController', () => {
  let controller: SupervisorController;

  // antes de cada prueba se crea un módulo de testing con el controlador.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupervisorController],
    }).compile();

    controller = module.get<SupervisorController>(SupervisorController);
  });

  // prueba básica para verificar que el controlador esté definido.
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
