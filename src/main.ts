import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 8000;
  const hostname = process.env.HOSTNAME || 'localhost';

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('api');

  // URI versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
    prefix: 'v',
  });

  // Global validation pipes
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }));
  
  await app.listen(port);

  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
}

bootstrap()