"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.getUserByEmail = void 0;
const User_1 = __importDefault(require("src/users/User"));
const getResource_1 = __importDefault(require("@utilities/getResource"));
exports.getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () { return getResource_1.default(User_1.default, { name: 'email', value: email }); });
exports.getUserById = (userId, secure = true) => __awaiter(void 0, void 0, void 0, function* () {
    return getResource_1.default(User_1.default, { name: '_id', value: userId }, secure ? '' : '-password -email -confirmed');
});
