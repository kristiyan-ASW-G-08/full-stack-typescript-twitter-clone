"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const RESTError_1 = require("../utilities/RESTError");
const fileStorage = multer_1.default.diskStorage({
    // @ts-ignore
    destination: (_, file, cb) => {
        if (process.env.ALLOW_IMAGES === 'false') {
            const { message, status } = RESTError_1.errors.UnprocessableEntity;
            throw new RESTError_1.RESTError(status, message);
        }
        cb(null, './images');
    },
    // @ts-ignore
    filename: (_, file, cb) => {
        cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname.split('.')[0]}`);
    },
});
exports.default = fileStorage;
