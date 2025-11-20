import { Test, TestingModule } from '@nestjs/testing';
import { ComunicacionService } from './comunicacion.service';

// Pruebas unitarias para el servicio de comunicación
describe('ComunicacionService', () => {
  let service: ComunicacionService;

  // Configuración del módulo de pruebas antes de cada test
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComunicacionService],
    }).compile();

    service = module.get<ComunicacionService>(ComunicacionService);
  });

  // Test para verificar que el servicio está definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
