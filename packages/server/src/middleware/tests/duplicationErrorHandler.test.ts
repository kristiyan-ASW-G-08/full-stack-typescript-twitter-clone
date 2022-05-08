import duplicationErrorHandler from '@customMiddleware/duplicationErrorHandler';
import { errors } from '@utilities/RESTError';
import ValidationError from '@twtr/common/source/types/ValidationError';
import { Response } from 'express';

describe('duplicationErrorHandler', (): void => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it('should call return status code 400 and validation errors', (): void => {
    expect.assertions(4);
    const jsMock = jest.fn();
    const statusMock = jest.fn().mockImplementation(() => ({
      json: jsMock,
    }));
    const resMock = ({ status: statusMock } as unknown) as Response;
    const value = 'TestUser';
    const path = 'username';
    const MongooseError = {
      errors: {
        username: {
          value,
          path,
        },
      },
    };

    const { status } = errors.Conflict;
    const validationErrors: ValidationError[] = [
      { path, message: `${value} is already taken` },
    ];
    duplicationErrorHandler(MongooseError, resMock);

    expect(statusMock).toHaveBeenCalledTimes(1);
    expect(statusMock).toHaveBeenCalledWith(status);
    expect(jsMock).toHaveBeenCalledTimes(1);
    expect(jsMock).toHaveBeenCalledWith({ data: validationErrors });
  });
});
