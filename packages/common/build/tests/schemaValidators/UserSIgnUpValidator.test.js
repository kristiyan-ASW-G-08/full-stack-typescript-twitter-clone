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
const UserSignUpValidator_1 = __importDefault(require("@schemaValidators/UserSignUpValidator"));
describe('UserSignUpValidator', () => {
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testmail@mail.com';
    const password = 'testPassword';
    const invalidPassword = '1234';
    it(`should validate successfully`, () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username,
            handle,
            email,
            password,
            confirmPassword: password,
        };
        yield expect(UserSignUpValidator_1.default.validate(user, { abortEarly: false })).resolves.toBe(user);
    }));
    it(`should throw an error`, () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            username: '',
            handle: '',
            email: '',
            password: invalidPassword,
            confirmPassword: invalidPassword,
        };
        yield expect(UserSignUpValidator_1.default.validate(user, { abortEarly: false })).rejects.toMatchSnapshot();
    }));
});
