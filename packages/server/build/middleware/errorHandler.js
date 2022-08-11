"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (error, _req, res) => {
    const status = error.status || 500;
    const { message, data } = error;
    const resData = data ? { data, message } : { message };
    res.status(status).json(resData);
};
exports.default = errorHandler;
