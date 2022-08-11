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
const Tweet_1 = __importDefault(require("src/tweets/Tweet"));
const User_1 = __importDefault(require("src/users/User"));
const connectToDB_1 = __importDefault(require("@utilities/connectToDB"));
describe('Tweet model', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    const user = mongoose_1.default.Types.ObjectId().toString();
    const type = 'text';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield connectToDB_1.default(mongoURI);
        yield User_1.default.deleteMany({}).exec();
        yield Tweet_1.default.deleteMany({}).exec();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.deleteMany({}).exec();
        yield Tweet_1.default.deleteMany({}).exec();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    it('should create a new tweet when validation is successful', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(6);
        const tweet = new Tweet_1.default({
            user,
            type,
        });
        yield expect(tweet.save()).resolves.not.toThrowError();
        expect(tweet.user.toString()).toMatch(user.toString());
        expect(tweet.type).toMatch(type);
        expect(tweet.likes).toBe(0);
        expect(tweet.replies).toBe(0);
        expect(tweet.retweets).toBe(0);
    }));
});
