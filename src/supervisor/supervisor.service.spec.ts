import { Test, TestingModule } from '@nestjs/testing';
import { SupervisorService } from './supervisor.service';

// esto contiene pruebas unitarias básicas para SupervisorService.
describe('SupervisorService', () => {
  let service: SupervisorService;

  // esto contiene pruebas unitarias básicas para SupervisorService.
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupervisorService],
    }).compile();

    service = module.get<SupervisorService>(SupervisorService);
  });

  // prueba básica para verificar que el servicio esté definido.
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
