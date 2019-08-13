import passErrorToNext from '@utilities/passErrorToNext';
import { CustomError, errors } from '@utilities/CustomError';

describe('passErrorToNext', (): void => {
  it(`should call next once`, (): void => {
    expect.assertions(2);
    const nextMock = jest.fn();
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message);
    passErrorToNext(error, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(error);
  });

  it("should throw an error with a status of 500: InternalServerError when the passed error doesn't have status code", (): void => {
    expect.assertions(2);
    const nextMock = jest.fn();
    const error = new Error('test error');
    const { status, message } = errors.InternalServerError;
    const expectedError = new CustomError(status, message, error.message);
    passErrorToNext(error, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(expectedError);
  });
});
