import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
  const nodeEnv = configService.get<string>('nodeEnv') || 'development';
  const frontendUrl = configService.get<string>('frontendUrl') || 'http://localhost:5173';

  // Trust proxy for correct IP detection behind Nginx (throttler, logs)
  app.set('trust proxy', 1);

  // Security headers
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false,
    }),
  );

  // Cookie parser
  app.use(cookieParser());

  // CORS
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Body size limits (protect against payload flooding)
  app.use(require('express').json({ limit: '1mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '1mb' }));

  // Static files for uploads
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    },
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger — only in non-production environments
  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Interview Prep API')
      .setDescription('API for Interview Preparation Platform')
      .setVersion('1.0')
      .addCookieAuth('access_token')
      .addTag('Auth', 'Authentication endpoints')
      .addTag('Materials', 'Study materials')
      .addTag('Chat', 'AI Chat sessions')
      .addTag('Tests', 'Quiz and testing')
      .addTag('Stats', 'Statistics')
      .addTag('Profile', 'User profile management')
      .addTag('Notifications', 'Notification settings')
      .addTag('Roadmaps', 'Database-backed learning roadmaps')
      .addTag('Live Coding', 'Database-backed coding tasks')
      .addTag('Test Catalog', 'Database-backed test catalog')
      .addTag('Content Admin', 'Content management and import review')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`Application is running on: http://localhost:${port}`);
  if (nodeEnv !== 'production') {
    console.log(`Swagger docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap();
