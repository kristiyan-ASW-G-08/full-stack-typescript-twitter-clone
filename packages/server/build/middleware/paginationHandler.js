"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSortString_1 = __importDefault(require("@utilities/getSortString"));
const paginationHandler = (req, _, next) => {
    const sort = req.query.sort || 'new';
    req.pagination = {
        limit: parseInt(req.query.limit, 10) || 25,
        sort,
        page: parseInt(req.query.page, 10) || 1,
        sortString: getSortString_1.default(sort),
    };
    next();
};
exports.default = paginationHandler;
