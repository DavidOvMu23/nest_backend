import { Test, TestingModule } from '@nestjs/testing';
import { GrupoController } from './grupo.controller';

//unit test para el controlador GrupoController
describe('GrupoController', () => {
  let controller: GrupoController;

  //antes de cada prueba, se crea un módulo de prueba que incluye el controlador GrupoController
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GrupoController],
    }).compile();

    controller = module.get<GrupoController>(GrupoController);
  });

  //prueba para verificar que el controlador se ha definido correctamente
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
