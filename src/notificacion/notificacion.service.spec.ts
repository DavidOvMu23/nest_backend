import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionService } from './notificacion.service';

// Este archivo contiene pruebas unitarias básicas para NotificacionService.
describe('NotificacionService', () => {
  let service: NotificacionService;

  // esto hace que antes de cada prueba se cree un módulo de testing con el servicio.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificacionService],
    }).compile();

    service = module.get<NotificacionService>(NotificacionService);
  });

  // prueba básica para verificar que el servicio esté definido.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
