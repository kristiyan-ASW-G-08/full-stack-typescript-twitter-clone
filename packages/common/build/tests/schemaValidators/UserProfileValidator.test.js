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
const UserProfileValidator_1 = __importDefault(require("@schemaValidators/UserProfileValidator"));
describe('UserProfileValidator', () => {
    const validUsers = [
        {
            username: 'validUsername',
            handle: 'testUserHandle',
            website: 'https://testwebsite.test',
        },
        {
            username: 'Barbatos',
            handle: 'LupusREx',
            website: 'http://somewebsite.com',
        },
    ];
    const invalidUsers = [
        {
            username: '',
            handle: '',
            website: 'testwebsite.test',
        },
    ];
    it.each(validUsers)('should validate successfully', (user) => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        yield expect(UserProfileValidator_1.default.validate(user, { abortEarly: false })).resolves.toBe(user);
    }));
    it.each(invalidUsers)('should validate unsuccessfully', (user) => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        yield expect(UserProfileValidator_1.default.validate(user, { abortEarly: false })).rejects.toMatchSnapshot();
    }));
});
