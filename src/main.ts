import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  console.log('Usuario:', process.env.DB_USER);
  console.log('Contraseña:', process.env.DB_PASSWORD);


  // Permite conexiones desde fuera del contenedor (Docker)
  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
}

bootstrap();
