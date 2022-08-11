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
const isAuthorized_1 = __importDefault(require("@utilities/isAuthorized"));
const mongoose_1 = __importDefault(require("mongoose"));
describe('isAuthorized', () => {
    const authorizedUserId = mongoose_1.default.Types.ObjectId().toString();
    const userId = mongoose_1.default.Types.ObjectId().toString();
    it(`should throw an error when the ids don't match`, () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        expect(() => (0, isAuthorized_1.default)(authorizedUserId, userId)).toThrow();
        expect(() => (0, isAuthorized_1.default)(authorizedUserId, userId)).toMatchInlineSnapshot(`[Function]`);
    }));
    it(`shouldn't throw an error when the ids match`, () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        expect(() => (0, isAuthorized_1.default)(authorizedUserId, authorizedUserId)).not.toThrow();
    }));
});
