import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { INestApplication, RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import moment from 'moment-timezone';

async function bootstrap() {
  const app: INestApplication = await NestFactory.create(AppModule);
  const port: number = Number(process.env.PORT) || 8000;
  const hostname: string = process.env.HOSTNAME || 'localhost';

  moment.tz.setDefault('Asia/Jakarta');

  app.use(helmet());
  app.use(compression());
  app.use(cookieParser(process.env.COOKIE_SECRET));  

  app.enableCors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization', 'Cookie'],
    preflightContinue: true,
    optionsSuccessStatus: 204,
    maxAge: 3600,
  });
  
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