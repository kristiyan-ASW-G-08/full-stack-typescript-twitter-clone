import { createRequest, createResponse } from 'node-mocks-http';
import errorHandler from '@customMiddleware/errorHandler';
import RESTError from '@utilities/RESTError';
import logger from '@utilities/logger';
import ValidationError from '@twtr/common/source/types/ValidationError';

jest.mock('@utilities/RESTError');
jest.mock('@utilities/logger');

const loggerMock = logger as jest.Mocked<typeof logger>;
const RESTErrorMock = RESTError as jest.MockedClass<typeof RESTError>;

describe('errorHandler', () => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it('should call logger.error and send a response with the correct status code, message, and data', () => {
    expect.assertions(5);
    RESTErrorMock.mockImplementationOnce(
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status,
        message,
        data,
        name: 'error',
      }),
    );
    const reqMock = createRequest({
      method: 'POST',
      url: '/',
    });
    const resMock = createResponse();

    const statusMock = jest.spyOn(resMock, 'status');
    const jsonMock = jest.spyOn(resMock, 'json');
    const nextMock = jest.fn();
    const status = 400;
    const message = 'Error Message';
    const data = 'Error Data';
    const error = new RESTError(status, message, data);

    errorHandler(error, reqMock, resMock, nextMock);

    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith(error);
    expect(statusMock).toHaveBeenCalledWith(status);
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledWith({ data, message });
  });
  it('undefined status code and data:should call logger.error and send a response with the correct status code, message, and data', () => {
    expect.assertions(5);

    // @ts-ignore
    RESTErrorMock.mockImplementationOnce(
      // @ts-ignore
      (status: number, message: string, data?: ValidationError[] | string) => ({
        status: undefined,
        message,
        data: undefined,
        name: 'error',
      }),
    );
    const reqMock = createRequest({
      method: 'POST',
      url: '/',
    });
    const resMock = createResponse();

    const statusMock = jest.spyOn(resMock, 'status');
    const jsonMock = jest.spyOn(resMock, 'json');
    const nextMock = jest.fn();
    const status = 400;
    const message = 'Error Message';
    const data = 'Error Data';
    const error = new RESTError(status, message, data);

    errorHandler(error, reqMock, resMock, nextMock);

    expect(loggerMock.error).toHaveBeenCalledTimes(1);
    expect(loggerMock.error).toHaveBeenCalledWith(error);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledWith({ message });
  });
});
