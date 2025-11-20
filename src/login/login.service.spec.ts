import { Test, TestingModule } from '@nestjs/testing';
import { LoginService } from './login.service';

// Pruebas unitarias para LoginService
describe('LoginService', () => {
  let service: LoginService;

  // Configuración del módulo de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoginService],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  // Verificación de que el servicio esté definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
