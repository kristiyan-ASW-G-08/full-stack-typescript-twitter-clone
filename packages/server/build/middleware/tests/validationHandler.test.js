"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const validationHandler_1 = __importDefault(require("@customMiddleware/validationHandler"));
const RESTError_1 = __importDefault(require("@utilities/RESTError"));
jest.mock('@utilities/RESTError');
const RESTErrorMock = RESTError_1.default;
const validate = jest.fn();
const TestValidatorMock = { validate };
describe('validationHandler', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    it(`should call next when a validation doesn't occur`, () => __awaiter(void 0, void 0, void 0, function* () {
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
        const req = node_mocks_http_1.default.createRequest({
            method: 'POST',
            url: '/',
            body,
            query,
            params,
        });
        const res = node_mocks_http_1.default.createResponse();
        const next = jest.fn();
        const validators = [
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
        yield (0, validationHandler_1.default)(validators)(req, res, next);
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
    }));
    it(`should call next when a validation error occurs`, () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(6);
        const validationErrors = [
            { path: 'username', message: 'username is not correct' },
        ];
        validate.mockRejectedValue({ inner: validationErrors });
        const body = {
            username: 'John Doe',
            email: 'johnDoe@test.test',
        };
        RESTErrorMock.mockImplementationOnce((status, message, data) => ({
            status,
            message,
            data,
            name: 'error',
        }));
        const params = {
            id: 'testId',
        };
        const query = {
            sort: 'new',
        };
        const req = node_mocks_http_1.default.createRequest({
            method: 'POST',
            url: '/',
            body,
            query,
            params,
        });
        const resMock = node_mocks_http_1.default.createResponse();
        const statusMock = jest.spyOn(resMock, 'status');
        const jsonMock = jest.spyOn(resMock, 'json');
        const next = jest.fn();
        const validators = [
            {
                schema: TestValidatorMock,
                target: 'body',
            },
        ];
        yield (0, validationHandler_1.default)(validators)(req, resMock, next);
        expect(TestValidatorMock.validate).toHaveBeenCalledTimes(1);
        expect(TestValidatorMock.validate).toHaveBeenNthCalledWith(1, body, {
            abortEarly: false,
        });
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledTimes(1);
        expect(jsonMock).toHaveBeenCalledWith({ data: validationErrors });
    }));
});
