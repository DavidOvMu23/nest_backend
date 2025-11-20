import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// Controlador principal de la aplicación que maneja las solicitudes HTTP entrantes
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // Maneja las solicitudes GET a la ruta raíz y devuelve un saludo
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
