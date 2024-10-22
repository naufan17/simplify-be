import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { INestApplication, VersioningType } from '@nestjs/common';
import { ThrottlerExceptionFilter } from './common/filters/throttler-exception/throttler-exception.filter';
import { InternalServerErrorExceptionFilter } from './common/filters/internal-server-error-exception/internal-server-error-exception.filter';
import { NotFoundExceptionFilter } from './common/filters/not-found-exception/not-found-exception.filter';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const port: number = Number(process.env.PORT) || 8000;
  const hostname: string = process.env.HOSTNAME || 'localhost';

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors();
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
    prefix: 'v',
  });
  
  app.useGlobalFilters(
    new ThrottlerExceptionFilter(),
    new NotFoundExceptionFilter(),
    new InternalServerErrorExceptionFilter()
  );

  await app.listen(port);

  console.log(`⚡️[server]: Server is running at http://${hostname}:${port}`);
}

bootstrap()