import { Injectable } from '@nestjs/common';

// Servicio principal de la aplicación que proporciona métodos globales
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
