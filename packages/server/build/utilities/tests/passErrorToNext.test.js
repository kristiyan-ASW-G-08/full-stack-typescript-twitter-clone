"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passErrorToNext_1 = __importDefault(require("@utilities/passErrorToNext"));
const RESTError_1 = __importStar(require("@utilities/RESTError"));
jest.mock('@utilities/RESTError');
const RESTErrorMock = RESTError_1.default;
describe('passErrorToNext', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    it(`should call next with the passed error if it has a status code`, () => {
        expect.assertions(2);
        RESTErrorMock.mockImplementation((status, message, data) => ({
            status,
            message,
            data,
            name: 'error',
        }));
        const nextMock = jest.fn();
        const { status, message } = RESTError_1.errors.NotFound;
        const error = new RESTError_1.default(status, message);
        passErrorToNext_1.default(error, nextMock);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(error);
    });
    it(`should call next with new RESTError if the passed error doesn't have a status code`, () => {
        expect.assertions(2);
        RESTErrorMock.mockImplementation((status, message, data) => ({
            status,
            message,
            data,
            name: 'error',
        }));
        const nextMock = jest.fn();
        const { status, message } = RESTError_1.errors.InternalServerError;
        const error = new Error('Message');
        // @ts-ignore
        const restError = new RESTError_1.default(status, message, error);
        passErrorToNext_1.default(error, nextMock);
        expect(nextMock).toHaveBeenCalledTimes(1);
        expect(nextMock).toHaveBeenCalledWith(restError);
    });
});
