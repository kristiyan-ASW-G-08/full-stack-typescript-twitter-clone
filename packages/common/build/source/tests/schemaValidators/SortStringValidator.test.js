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
const SortStringValidator_1 = __importDefault(require("@schemaValidators/SortStringValidator"));
describe('SortStringValidator', () => {
    const validQueries = [
        {
            limit: 25,
            page: 1,
            sort: 'top',
        },
        {
            limit: 5,
            page: 1,
            sort: 'new',
        },
        {
            limit: 15,
            page: 1,
            sort: 'trending',
        },
        {
            limit: 50,
            page: 100,
            sort: 'replies',
        },
    ];
    const invalidQueries = [
        {
            limit: 100000,
            page: -2,
            sort: 'other',
        },
        {
            limit: -100,
            page: 1,
            sort: 'some',
        },
        {
            limit: 100000000000,
            page: -100,
            sort: 'zeta',
        },
        {
            limit: 50,
            page: 100,
            sort: 'beta',
        },
    ];
    it.each(validQueries)('should validate successfully', (query) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(SortStringValidator_1.default.validate(query, { abortEarly: false })).resolves.toBe(query);
    }));
    it.each(invalidQueries)('should validate unsuccessfully', (query) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(SortStringValidator_1.default.validate(query, { abortEarly: false })).rejects.toMatchSnapshot();
    }));
});
