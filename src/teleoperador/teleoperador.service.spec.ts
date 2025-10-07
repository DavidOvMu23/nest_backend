import { Test, TestingModule } from '@nestjs/testing';
import { TeleoperadorService } from './teleoperador.service';

describe('TeleoperadorService', () => {
  let service: TeleoperadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeleoperadorService],
    }).compile();

    service = module.get<TeleoperadorService>(TeleoperadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
