import { Test, TestingModule } from '@nestjs/testing';
import { CustomLogger } from './logger.service';
import winston from 'winston';

describe('CustomLogger', () => {
  let service: CustomLogger;
  let loggerSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomLogger],
    }).compile();

    service = module.get<CustomLogger>(CustomLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should log a message', () => {
    loggerSpy = jest.spyOn(winston.Logger.prototype, 'info');
    const message = 'This is a log message';

    service.log(message);

    expect(loggerSpy).toHaveBeenCalledWith(message);
  });

  it('should log an error message', () => {
    loggerSpy = jest.spyOn(winston.Logger.prototype, 'error');
    const errorMessage = 'This is an error message';

    service.error(errorMessage);

    expect(loggerSpy).toHaveBeenCalledWith(errorMessage, undefined);
  });

  it('should log a warning message', () => {
    loggerSpy = jest.spyOn(winston.Logger.prototype, 'warn');
    const warningMessage = 'This is a warning message';

    service.warn(warningMessage);

    expect(loggerSpy).toHaveBeenCalledWith(warningMessage);
  });

  it('should log a debug message', () => {
    loggerSpy = jest.spyOn(winston.Logger.prototype, 'debug');
    const debugMessage = 'This is a debug message';

    service.debug(debugMessage);

    expect(loggerSpy).toHaveBeenCalledWith(debugMessage);
  });

  it('should log a verbose message', () => {
    loggerSpy = jest.spyOn(winston.Logger.prototype, 'verbose');
    const verboseMessage = 'This is a verbose message';

    service.verbose(verboseMessage);

    expect(loggerSpy).toHaveBeenCalledWith(verboseMessage);
  });
});
