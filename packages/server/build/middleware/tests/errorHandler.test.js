"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = require("node-mocks-http");
const errorHandler_1 = __importDefault(require("@customMiddleware/errorHandler"));
const RESTError_1 = __importDefault(require("@utilities/RESTError"));
const logger_1 = __importDefault(require("@utilities/logger"));
jest.mock('@utilities/RESTError');
jest.mock('@utilities/logger');
const loggerMock = logger_1.default;
const RESTErrorMock = RESTError_1.default;
describe('errorHandler', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    it('should call logger.error and send a response with the correct status code, message, and data', () => {
        expect.assertions(5);
        RESTErrorMock.mockImplementationOnce((status, message, data) => ({
            status,
            message,
            data,
            name: 'error',
        }));
        const reqMock = (0, node_mocks_http_1.createRequest)({
            method: 'POST',
            url: '/',
        });
        const resMock = (0, node_mocks_http_1.createResponse)();
        const statusMock = jest.spyOn(resMock, 'status');
        const jsonMock = jest.spyOn(resMock, 'json');
        const status = 400;
        const message = 'Error Message';
        const data = 'Error Data';
        const error = new RESTError_1.default(status, message, data);
        (0, errorHandler_1.default)(error, reqMock, resMock);
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
        (status, message, data) => ({
            status: undefined,
            message,
            data: undefined,
            name: 'error',
        }));
        const reqMock = (0, node_mocks_http_1.createRequest)({
            method: 'POST',
            url: '/',
        });
        const resMock = (0, node_mocks_http_1.createResponse)();
        const statusMock = jest.spyOn(resMock, 'status');
        const jsonMock = jest.spyOn(resMock, 'json');
        const status = 400;
        const message = 'Error Message';
        const data = 'Error Data';
        const error = new RESTError_1.default(status, message, data);
        (0, errorHandler_1.default)(error, reqMock, resMock);
        expect(loggerMock.error).toHaveBeenCalledTimes(1);
        expect(loggerMock.error).toHaveBeenCalledWith(error);
        expect(statusMock).toHaveBeenCalledWith(500);
        expect(jsonMock).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith({ message });
    });
});
