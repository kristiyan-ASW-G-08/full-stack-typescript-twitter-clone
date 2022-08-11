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
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = __importDefault(require("src/users/User"));
const connectToDB_1 = __importDefault(require("utilities/connectToDB"));
const duplicationErrorHandler_1 = __importDefault(require("customMiddleware/duplicationErrorHandler"));
jest.mock('customMiddleware/duplicationErrorHandler');
const duplicationErrorHandlerMock = duplicationErrorHandler_1.default;
describe('User', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testEmailmail.com';
    const password = 'testPassword';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connectToDB_1.default)(mongoURI);
        yield User_1.default.deleteMany({}).exec();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.deleteMany({}).exec();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    it('should throw an error when validation is not passed', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(3);
        const userObj = {
            username,
            handle,
            email,
            password,
        };
        yield User_1.default.insertMany([userObj]);
        const user = new User_1.default(userObj);
        yield expect(user.save()).rejects.toThrowError();
        expect(duplicationErrorHandlerMock).toHaveBeenCalledTimes(0);
        expect(user.validate).toThrowError();
    }));
    it('should create a new user when validation is successful', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(16);
        const user = new User_1.default({
            username,
            handle,
            email,
            password,
        });
        yield expect(user.save()).resolves.not.toThrowError();
        expect(duplicationErrorHandlerMock).toHaveBeenCalledTimes(0);
        expect(user).toMatchObject({
            username,
            handle,
            email,
            password,
        });
        expect(user.username).toBe(username);
        expect(user.handle).toBe(handle);
        expect(user.email).toBe(email);
        expect(user.password).toBe(password);
        // email confirmation is disabled
        expect(user.isConfirmed).toBeTruthy();
        expect(user.date).toBeDefined();
        expect(user._id).toBeDefined();
        expect(user.followers).toBe(0);
        expect(user.following.length).toBe(0);
        expect(user.likes.length).toBe(0);
        expect(user.bookmarks.length).toBe(0);
        expect(user.retweets.length).toBe(0);
        expect(user.replies.length).toBe(0);
    }));
});
