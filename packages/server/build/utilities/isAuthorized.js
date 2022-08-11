"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RESTError_1 = require("@utilities/RESTError");
const isAuthorized = (authorizedUserId, userId) => {
    if (authorizedUserId !== userId) {
        const { status, message } = RESTError_1.errors.Unauthorized;
        throw new RESTError_1.RESTError(status, message);
    }
};
exports.default = isAuthorized;
