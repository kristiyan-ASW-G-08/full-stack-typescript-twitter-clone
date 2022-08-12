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
const ResetPasswordValidator_1 = __importDefault(require("@schemaValidators/ResetPasswordValidator"));
describe('ResetPasswordValidator', () => {
    const validPasswords = ['123456789012', 'somePassword10', 'validPassword'];
    const invalidPasswords = [
        { password: 'somePassword10', confirmPassword: 'validPassword' },
        { password: '' },
        { password: 'Password' },
    ];
    it.each(validPasswords)('should validate successfully', (password) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(ResetPasswordValidator_1.default.validate({ password, confirmPassword: password }, { abortEarly: false })).resolves.toStrictEqual({ password, confirmPassword: password });
    }));
    it.each(invalidPasswords)('should validate unsuccessfully', (body) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(ResetPasswordValidator_1.default.validate(body, { abortEarly: false })).rejects.toMatchSnapshot();
    }));
});
