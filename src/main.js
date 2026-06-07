"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('API de Control de Ventas')
        .setDescription('Documentación completa de la API del sistema de Control de Ventas')
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Ingresa tu token JWT',
        in: 'header',
    }, 'JWT-auth')
        .addTag('auth', 'Autenticación')
        .addTag('users', 'Usuarios')
        .addTag('products', 'Productos')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            authorizations: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                },
            },
        },
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`🚀 Servidor ejecutándose en http://localhost:${port}`);
    console.log(`📝 API disponible en http://localhost:${port}/api`);
    console.log(`📚 Documentación Swagger en http://localhost:${port}/api/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map