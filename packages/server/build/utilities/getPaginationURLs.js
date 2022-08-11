"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const renderUrl_1 = __importDefault(require("./renderUrl"));
const getNavigationURLs = ({ page, urlExtension, count, queries, }) => {
    return {
        nextPage: count > 0
            ? (0, renderUrl_1.default)(urlExtension, Object.assign(Object.assign({}, queries), { page: page + 1 }))
            : null,
        prevPage: page > 1 ? (0, renderUrl_1.default)(urlExtension, Object.assign(Object.assign({}, queries), { page: page - 1 })) : null,
    };
};
exports.default = getNavigationURLs;
