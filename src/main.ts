import 'reflect-metadata';
import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS
  app.enableCors();

   const reflector = app.get(Reflector);
   app.useGlobalGuards(new JwtAuthGuard(reflector));

  // Validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Prefijo global para la API
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Control de Ventas')
    .setDescription('Documentación completa de la API del sistema de Control de Ventas')
    .setVersion('1.0')
    .addBearerAuth() // Para agregar autenticación JWT
    .addTag('auth', 'Autenticación')
    .addTag('users', 'Usuarios')
    .addTag('products', 'Productos')
    .addTag('categories', 'Categorías')
    .addTag('customers', 'Clientes')
    .addTag('suppliers', 'Proveedores')
    .addTag('sales', 'Ventas')
    .addTag('purchases', 'Compras')
    .addTag('inventory', 'Inventario')
    .addTag('reports', 'Reportes')
    .addTag('backup', 'Respaldos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Swagger estará en /api/docs

  // Iniciar servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
  console.log(`API disponible en http://localhost:${port}/api`);
  console.log(`Documentación Swagger en http://localhost:${port}/api/docs`);
}
bootstrap();