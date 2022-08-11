"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const fileFilter_1 = __importDefault(require("@customMiddleware/fileFilter"));
describe('fileFilter', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    const reqMock = node_mocks_http_1.default.createRequest({
        method: 'POST',
        url: '/',
    });
    const formats = ['image/png', 'image/jpg', 'image/jpeg', 'image/svg+xml'];
    const unacceptableFormats = ['audio', 'application', 'text', 'video'];
    it.each(formats)('should call cb once with true', (format) => {
        expect.assertions(2);
        const cb = jest.fn();
        fileFilter_1.default(reqMock, { mimetype: format }, cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(null, true);
    });
    it.each(unacceptableFormats)('should call cb once with false', (format) => {
        expect.assertions(2);
        const cb = jest.fn();
        fileFilter_1.default(reqMock, { mimetype: format }, cb);
        expect(cb).toHaveBeenCalledTimes(1);
        expect(cb).toHaveBeenCalledWith(null, false);
    });
});
