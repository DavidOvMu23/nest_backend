import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioContactoController } from './usuario_contacto.controller';

describe('UsuarioContactoController', () => {
  let controller: UsuarioContactoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsuarioContactoController],
    }).compile();

    controller = module.get<UsuarioContactoController>(UsuarioContactoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
