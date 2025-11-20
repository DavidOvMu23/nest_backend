import { Test, TestingModule } from '@nestjs/testing';
import { TrabajadorService } from './trabajador.service';

// Pruebas unitarias básicas para TrabajadorService.
describe('TrabajadorService', () => {
  let service: TrabajadorService;

  // Antes de cada prueba se crea un módulo de testing con el servicio.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrabajadorService],
    }).compile();

    service = module.get<TrabajadorService>(TrabajadorService);
  });

  // Prueba básica para verificar que el servicio esté definido.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
