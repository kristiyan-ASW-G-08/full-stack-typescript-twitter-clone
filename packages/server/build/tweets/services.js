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
exports.getTweetById = void 0;
const Tweet_1 = __importDefault(require("src/tweets/Tweet"));
const getResource_1 = __importDefault(require("../utilities/getResource"));
const getTweetById = (tweetId) => __awaiter(void 0, void 0, void 0, function* () { return (0, getResource_1.default)(Tweet_1.default, { name: '_id', value: tweetId }); });
exports.getTweetById = getTweetById;
exports.default = exports.getTweetById;
