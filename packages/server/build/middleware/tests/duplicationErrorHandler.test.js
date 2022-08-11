"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const duplicationErrorHandler_1 = __importDefault(require("@customMiddleware/duplicationErrorHandler"));
const RESTError_1 = require("@utilities/RESTError");
describe('duplicationErrorHandler', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    it('should call return status code 400 and validation errors', () => {
        expect.assertions(4);
        const jsMock = jest.fn();
        const statusMock = jest.fn().mockImplementation(() => ({
            json: jsMock,
        }));
        const resMock = { status: statusMock };
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
        const { status } = RESTError_1.errors.Conflict;
        const validationErrors = [
            { path, message: `${value} is already taken` },
        ];
        duplicationErrorHandler_1.default(MongooseError, resMock);
        expect(statusMock).toHaveBeenCalledTimes(1);
        expect(statusMock).toHaveBeenCalledWith(status);
        expect(jsMock).toHaveBeenCalledTimes(1);
        expect(jsMock).toHaveBeenCalledWith({ data: validationErrors });
    });
});
