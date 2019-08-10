import { CustomError, errors } from '@utilities/CustomError';
import ValidationError from '@twtr/common/source/types/ValidationError';

describe('CustomError', (): void => {
  it('should have correct status,message and data', (): void => {
    expect.assertions(3);
    const { status, message } = errors.BadRequest;

    const validationErrorArr: ValidationError[] = [
      {
        name: 'test',
        message: 'error',
      },
    ];
    const error = new CustomError(status, message, validationErrorArr);
    expect(error.status).toEqual(status);
    expect(error.message).toEqual(message);
    expect(error.data).toEqual(validationErrorArr);
  });
});
