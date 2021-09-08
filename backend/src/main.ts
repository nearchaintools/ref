import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';

import {
  CorsConfig,
  NestConfig,
  SwaggerConfig,
} from './configs/config.interface';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  server.use(cookieParser());

  // Validation
  server.useGlobalPipes(new ValidationPipe());

  const configService = server.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title || 'Nestjs')
      .setDescription(swaggerConfig.description || 'The nestjs API description')
      .setVersion(swaggerConfig.version || '1.0')
      .build();
    const document = SwaggerModule.createDocument(server, options);

    SwaggerModule.setup(swaggerConfig.path || 'api', server, document);
  }

  // Cors
  if (corsConfig.enabled) {
    server.enableCors({ origin: 'http://localhost:3007', credentials: true });
  }

  await server.listen(process.env.PORT || nestConfig.port || 4000);
}
bootstrap();
