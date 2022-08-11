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
const services_1 = require("src/users/services");
const User_1 = __importDefault(require("src/users/User"));
const getResource_1 = __importDefault(require("@utilities/getResource"));
jest.mock('@utilities/getResource');
const getResourceMock = getResource_1.default;
describe('userServices', () => {
    afterEach(() => jest.clearAllMocks());
    describe('getUserByEmail', () => {
        it(`should call getResource`, () => __awaiter(void 0, void 0, void 0, function* () {
            const email = 'testmail@mail.com';
            expect.assertions(2);
            yield services_1.getUserByEmail(email);
            expect(getResource_1.default).toHaveBeenCalledTimes(1);
            expect(getResourceMock).toHaveBeenCalledWith(User_1.default, {
                name: 'email',
                value: email,
            });
        }));
    });
    describe('getUserById', () => {
        it(`should call getResource`, () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const userId = 'userId';
            yield services_1.getUserById(userId);
            expect(getResource_1.default).toHaveBeenCalledTimes(1);
            expect(getResourceMock).toHaveBeenCalledWith(User_1.default, {
                name: '_id',
                value: userId,
            }, '');
        }));
    });
});
