"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errors = exports.RESTError = void 0;
const errors = {
    BadRequest: {
        status: 400,
        message: 'Request has wrong format',
    },
    Unauthorized: {
        status: 401,
        message: 'Authentication credentials not valid or missing',
    },
    Forbidden: {
        status: 403,
        message: "You're missing permission to execute this request",
    },
    NotFound: {
        status: 404,
        message: 'Resource not found',
    },
    Conflict: {
        status: 409,
        message: 'Conflict',
    },
    UnprocessableEntity: {
        status: 422,
        message: 'Request cannot be processed',
    },
    TooManyRequests: {
        status: 429,
        message: 'Too many requests',
    },
    InternalServerError: {
        status: 500,
        message: 'Internal server error',
    },
};
exports.errors = errors;
class RESTError extends Error {
    constructor(status, message, data) {
        super();
        Object.setPrototypeOf(this, RESTError.prototype);
        this.status = status;
        this.message = message;
        this.data = data;
    }
}
exports.default = RESTError;
exports.RESTError = RESTError;
