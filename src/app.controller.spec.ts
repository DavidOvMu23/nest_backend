import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Pruebas unitarias para el AppController, verificando que el método getHello() retorne el string esperado "Hello World!"
describe('AppController', () => {
  let appController: AppController;

  // Configuración del módulo de pruebas antes de cada test
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  // Prueba para el método getHello()
  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
