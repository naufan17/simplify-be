import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { ThrottlerModule } from '@nestjs/throttler';
import { INestApplication } from '@nestjs/common';
import { TestController } from './test.controller';

describe('Throttler Rate Limiting', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ThrottlerModule.forRoot({
          ttl: 60000,
          limit: 2,
        }),
      ],
      controllers: [TestController],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should allow the first 2 requests', async () => {
    await request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect({ 
        status: 'Success' 
      });

    await request(app.getHttpServer())
      .get('/test')
      .expect(200)
      .expect({ 
        status: 'Success' 
      });
  });

  it('should return 429 after exceeding the limit', async () => {
    await request(app.getHttpServer())
      .get('/test')
      .expect(429)
      .expect({
        status: 'Failed',
        message: 'Too Many Requests, please try again later',
      });
  });
});
