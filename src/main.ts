import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// Función principal para arrancar la aplicación NestJS
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )
  const config = new DocumentBuilder()
    .setTitle('CuidemJunts API')
    .setDescription('API del backend de CuidemJunts')
    .setVersion('1.0')
    .addTag('supervisors')
    .build();
  // Creamos el documento una vez y lo pasamos a setup para que Swagger UI funcione.
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}

// Iniciamos la aplicación
bootstrap();
