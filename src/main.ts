import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { access } from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: RegExp('http://localhost:4200/*'),
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
