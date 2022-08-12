"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, _req, res, next) => {
    const status = error.status || 500;
    const { message, data } = error;
    res.status(status).json({ data: JSON.stringify(error), message, status });
};
exports.default = errorHandler;
