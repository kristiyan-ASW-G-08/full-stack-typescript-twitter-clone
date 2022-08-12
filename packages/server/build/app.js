"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const routes_1 = __importDefault(require("./users/routes"));
const routes_2 = __importDefault(require("./tweets/routes"));
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const app = (0, express_1.default)();
app.use(cors());
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
//@ts-ignore
app.use(body_parser_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type content-Type  Authorization');
    res.setHeader('Access-Control-Allow-Headers', 'content-Type');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization');
    next();
});
app.use('/images', express_1.default.static('./images'));
app.use(routes_1.default);
app.use(routes_2.default);
// populateDB();
app.use(errorHandler_1.default);
exports.default = app;
