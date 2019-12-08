import { Document } from 'mongoose';
import duplicationErrorHandler from '@customMiddleware/duplicationErrorHandler';
import RESTError, { errors } from '@utilities/RESTError';
import ValidationError from '@twtr/common/source/types/ValidationError';

jest.mock('@utilities/RESTError');
const RESTErrorMock = RESTError as jest.MockedClass<typeof RESTError>;

describe('duplicationErrorHandler', (): void => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it('should call next with RESTError containing 409 status, "Conflict" message and an array of validation errors, if the passed error is Mongo Error with 11000 code ', (): void => {
    expect.assertions(4);
    const nextMock = jest.fn();
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

    RESTErrorMock.mockImplementationOnce(
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status,
        message,
        data,
        name: 'error',
      }),
    );
    const { status, message } = errors.Conflict;
    const validationErrors: ValidationError[] = [
      { path, message: `${value} is already taken` },
    ];
    const documentMock = ({} as unknown) as Document;
    duplicationErrorHandler(MongooseError, documentMock, nextMock);

    expect(RESTErrorMock).toHaveBeenCalledTimes(1);
    expect(RESTErrorMock).toHaveBeenCalledWith(
      status,
      message,
      validationErrors,
    );
    expect(nextMock).toHaveBeenCalledTimes(1);
    expect(nextMock).toHaveBeenCalledWith({
      data: validationErrors,
      message,
      name: 'error',
      status,
    });
  });
});
