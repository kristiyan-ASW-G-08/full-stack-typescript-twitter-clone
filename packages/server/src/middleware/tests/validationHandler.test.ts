import httpMocks from 'node-mocks-http';
import { MixedSchema } from 'yup';
import ValidationError from '@twtr/common/source/types/ValidationError';
import Validator from '@customTypes/Validator';
import validationHandler from '@customMiddleware/validationHandler';
import RESTError from '@utilities/RESTError';

jest.mock('@utilities/RESTError');
const RESTErrorMock = RESTError as jest.MockedClass<typeof RESTError>;

const validate = jest.fn();
const TestValidatorMock = ({ validate } as unknown) as MixedSchema;
describe('validationHandler', (): void => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it(`should call next when a validation error occurs`, async (): Promise<
    void
  > => {
    expect.assertions(6);

    validate.mockResolvedValue({});
    const body = {
      username: 'John Doe',
      email: 'johnDoe@test.test',
    };
    const params = {
      id: 'testId',
    };
    const query = {
      sort: 'new',
    };
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      body,
      query,
      params,
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const validators: Validator[] = [
      {
        schema: TestValidatorMock,
        target: 'body',
      },
      {
        schema: TestValidatorMock,
        target: 'query',
      },
      {
        schema: TestValidatorMock,
        target: 'params',
      },
    ];
    await validationHandler(validators)(req, res, next);

    expect(TestValidatorMock.validate).toHaveBeenCalledTimes(3);

    expect(TestValidatorMock.validate).toHaveBeenNthCalledWith(1, body, {
      abortEarly: false,
    });
    expect(TestValidatorMock.validate).toHaveBeenNthCalledWith(2, query, {
      abortEarly: false,
    });
    expect(TestValidatorMock.validate).toHaveBeenNthCalledWith(3, params, {
      abortEarly: false,
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });
  it(`should call next when a validation error occurs`, async (): Promise<
    void
  > => {
    expect.assertions(6);
    const validationErrors = [
      { path: 'username', message: 'username is not correct' },
    ];
    validate.mockRejectedValue({ inner: validationErrors });
    const body = {
      username: 'John Doe',
      email: 'johnDoe@test.test',
    };

    RESTErrorMock.mockImplementationOnce(
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status,
        message,
        data,
        name: 'error',
      }),
    );

    const params = {
      id: 'testId',
    };
    const query = {
      sort: 'new',
    };
    const req = httpMocks.createRequest({
      method: 'POST',
      url: '/',
      body,
      query,
      params,
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();
    const validators: Validator[] = [
      {
        schema: TestValidatorMock,
        target: 'body',
      },
    ];
    const expectedError = {
      data: validationErrors,
      message: 'Request has wrong format',
      name: 'error',
      status: 400,
    };

    await validationHandler(validators)(req, res, next);

    expect(TestValidatorMock.validate).toHaveBeenCalledTimes(1);
    expect(TestValidatorMock.validate).toHaveBeenNthCalledWith(1, body, {
      abortEarly: false,
    });

    expect(RESTErrorMock).toHaveBeenCalledTimes(1);
    expect(RESTErrorMock).toHaveBeenCalledWith(
      400,
      'Request has wrong format',
      validationErrors,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(expectedError);
  });
});
