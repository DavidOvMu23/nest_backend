import { Test, TestingModule } from '@nestjs/testing';
import { NotificacionController } from './notificacion.controller';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
describe('NotificacionController', () => {
  let controller: NotificacionController;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificacionController],
    }).compile();

    controller = module.get<NotificacionController>(NotificacionController);
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
