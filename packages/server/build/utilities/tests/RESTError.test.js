"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RESTError_1 = require("utilities/RESTError");
describe('CustomError', () => {
    const errorData = 'ErrorData';
    it.each(Object.values(RESTError_1.errors))('RESTError should have the correct status, message, and error data', ({ status, message }) => {
        expect.assertions(4);
        const error = new RESTError_1.RESTError(status, message, errorData);
        expect(error).toBeInstanceOf(RESTError_1.RESTError);
        expect(error.status).toBe(status);
        expect(error.message).toMatch(message);
        expect(error.data).toMatch(errorData);
    });
});
