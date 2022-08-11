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
const EmailValidator_1 = __importDefault(require("@schemaValidators/EmailValidator"));
describe('EmailValidator', () => {
    const validEmails = [
        'testmail@mail.com',
        'someMail@gmail.com',
        'jojo@test.com',
    ];
    const invalidEmails = ['testmail@mail', 'someMailgmail.com', 'test.com'];
    it.each(validEmails)('should validate successfully', (email) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(EmailValidator_1.default.validate({ email }, { abortEarly: false })).resolves.toStrictEqual({ email });
    }));
    it.each(invalidEmails)('should validate unsuccessfully', (email) => __awaiter(void 0, void 0, void 0, function* () {
        yield expect(EmailValidator_1.default.validate({ email }, { abortEarly: false })).rejects.toMatchSnapshot();
    }));
});
