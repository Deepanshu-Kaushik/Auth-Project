import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:8000',
      'http://localhost:7000',
    ],
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'], // Add any additional headers you need
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // One day
  });
  dotenv.config();
  await app.listen(5000);
}
bootstrap();
