import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { INestApplication, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const port: number = Number(process.env.PORT) || 8000;
  const hostname: string = process.env.HOSTNAME || 'localhost';

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors();
  
  app.setGlobalPrefix('api', {
    exclude: [{
      path: '/:urlId',
      method: RequestMethod.GET
    }]
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0',
    prefix: 'v',
  });

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