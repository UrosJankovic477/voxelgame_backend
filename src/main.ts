import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import express from 'express'
import path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: RegExp('http://192.168.1.195:4200/*'),
  });
  app.use('/uploads', express.static(path.join(`${__dirname}../../../`, 'uploads')))
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
