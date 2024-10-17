import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CustomLogger } from 'src/logger/logger.service';

describe('AppController', () => {
  let controller: AppController;
  let logger: CustomLogger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: CustomLogger,
          useValue: {
            log: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AppController>(AppController);
    logger = module.get<CustomLogger>(CustomLogger);
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

    it('should call the logger', () => {
      controller.getHello();
      expect(logger.log).toHaveBeenCalledWith('Welcome to API Simplify version 1.0');
    });
  })
});
