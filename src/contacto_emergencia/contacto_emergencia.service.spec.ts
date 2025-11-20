import { Test, TestingModule } from '@nestjs/testing';
import { ContactoEmergenciaService } from './contacto_emergencia.service';

describe('ContactoEmergenciaService', () => {
  let service: ContactoEmergenciaService;

  // Configuración del módulo de pruebas
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContactoEmergenciaService],
    }).compile();

    service = module.get<ContactoEmergenciaService>(ContactoEmergenciaService);
  });

  // Prueba para verificar que el servicio esté definido
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
