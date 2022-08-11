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
const mongoose_1 = __importDefault(require("mongoose"));
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticationHandler_1 = __importDefault(require("@customMiddleware/authenticationHandler"));
const RESTError_1 = __importDefault(require("@utilities/RESTError"));
jest.mock('@utilities/RESTError');
const RESTErrorMock = RESTError_1.default;
jest.spyOn(jsonwebtoken_1.default, 'verify');
RESTErrorMock.mockImplementationOnce((status, message, data) => ({
    status,
    message,
    data,
    name: 'error',
}));
describe('authenticationHandler', () => {
    const { SECRET } = process.env;
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    it(`should add userId to req when the authorization header is valid`, () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(5);
        const nextMock = jest.fn();
        const userId = mongoose_1.default.Types.ObjectId();
        const token = jsonwebtoken_1.default.sign({
            userId,
        }, SECRET, { expiresIn: '1h' });
        const reqMock = node_mocks_http_1.default.createRequest({
            method: 'POST',
            url: '/',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const resMock = node_mocks_http_1.default.createResponse();
        authenticationHandler_1.default(reqMock, resMock, nextMock);
        expect(jsonwebtoken_1.default.verify).toHaveBeenCalledTimes(1);
        expect(jsonwebtoken_1.default.verify).toHaveBeenCalledWith(token, SECRET);
        expect(jsonwebtoken_1.default.verify).toHaveReturnedTimes(1);
        expect(reqMock.userId).toMatch(userId.toString());
        expect(nextMock).toBeCalledTimes(1);
    }));
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const nextMock = jest.fn();
        const reqMock = node_mocks_http_1.default.createRequest({
            method: 'POST',
            url: '/',
        });
        const resMock = node_mocks_http_1.default.createResponse();
        expect(() => authenticationHandler_1.default(reqMock, resMock, nextMock)).toThrowErrorMatchingSnapshot();
    }));
    it("should throw an error with a status of 401: Unauthorized when the decoded jwt token doesn't contain a user id ", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        const nextMock = jest.fn();
        const token = jsonwebtoken_1.default.sign({}, SECRET, { expiresIn: '1h' });
        const reqMock = node_mocks_http_1.default.createRequest({
            method: 'POST',
            url: '/',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const resMock = node_mocks_http_1.default.createResponse();
        expect(() => authenticationHandler_1.default(reqMock, resMock, nextMock)).toThrowErrorMatchingSnapshot();
    }));
});
