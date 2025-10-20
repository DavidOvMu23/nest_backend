import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioContactoService } from './usuario_contacto.service';

describe('UsuarioContactoService', () => {
  let service: UsuarioContactoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioContactoService],
    }).compile();

    service = module.get<UsuarioContactoService>(UsuarioContactoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
