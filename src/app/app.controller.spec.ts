import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('getHello', () => {
    it('should return the expected response', () => {
      expect(controller.getHello()).toEqual({
        status: 'Success',
        message: 'Welcome to API Simplify',
        data: {
          version: '1.0',
        },
      });
    });
  })
});
