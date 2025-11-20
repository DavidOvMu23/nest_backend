import { Test, TestingModule } from '@nestjs/testing';
import { TeleoperadorService } from './teleoperador.service';

// Pruebas unitarias básicas para TeleoperadorService.
describe('TeleoperadorService', () => {
  let service: TeleoperadorService;

  // Antes de cada prueba se crea un módulo de testing con el servicio.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeleoperadorService],
    }).compile();

    service = module.get<TeleoperadorService>(TeleoperadorService);
  });

  // Prueba básica para verificar que el servicio esté definido.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
