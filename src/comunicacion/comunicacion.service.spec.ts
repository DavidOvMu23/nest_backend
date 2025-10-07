import { Test, TestingModule } from '@nestjs/testing';
import { ComunicacionService } from './comunicacion.service';

describe('ComunicacionService', () => {
  let service: ComunicacionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ComunicacionService],
    }).compile();

    service = module.get<ComunicacionService>(ComunicacionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
