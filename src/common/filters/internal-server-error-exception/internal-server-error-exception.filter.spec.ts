import { InternalServerErrorExceptionFilter } from './internal-server-error-exception.filter';

describe('InternalServerErrorExceptionFilter', () => {
  it('should be defined', () => {
    expect(new InternalServerErrorExceptionFilter()).toBeDefined();
  });
});
