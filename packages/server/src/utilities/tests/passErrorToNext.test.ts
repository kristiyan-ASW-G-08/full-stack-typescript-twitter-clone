import passErrorToNext from '@utilities/passErrorToNext';
import { RESTError, errors } from '@utilities/RESTError';

describe('passErrorToNext', (): void => {
  it(`should call next once`, (): void => {
    expect.assertions(2);
    const nextMock = jest.fn();
    const { status, message } = errors.NotFound;
    const error = new RESTError(status, message);
    passErrorToNext(error, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(error);
  });

  it("should throw an error with a status of 500: InternalServerError when the passed error doesn't have status code", (): void => {
    expect.assertions(2);
    const nextMock = jest.fn();
    const error = new Error('test error');
    const { status, message } = errors.InternalServerError;
    const expectedError = new RESTError(status, message, error.message);
    passErrorToNext(error, nextMock);
    expect(nextMock).toBeCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith(expectedError);
  });
});
