"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RESTError_1 = require("@utilities/RESTError");
const duplicationErrorHandler = (duplicationErrors, res) => {
    if (duplicationErrors.errors) {
        const validationErrors = Object.values(duplicationErrors.errors).map(
        // @ts-ignore
        ({ value, path }) => ({
            path,
            message: `${value} is already taken`,
        }));
        const { status } = RESTError_1.errors.Conflict;
        console.log(validationErrors, res.status);
        res.status(status).json({ data: validationErrors });
    }
};
exports.default = duplicationErrorHandler;
