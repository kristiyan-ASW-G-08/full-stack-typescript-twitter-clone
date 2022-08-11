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
const supertest_1 = __importDefault(require("supertest"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const mjml_1 = __importDefault(require("mjml"));
const app_1 = __importDefault(require("src/app"));
const User_1 = __importDefault(require("src/users/User"));
const connectToDB_1 = __importDefault(require("utilities/connectToDB"));
const Tweet_1 = __importDefault(require("src/tweets/Tweet"));
jest.mock('utilities/uploadToCloudinary');
jest.mock('utilities/deleteFromCloudinary');
const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
mjml_1.default.mockReturnValue(mockTemplate);
jest.mock('mjml');
describe('tweetRoutes', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testmailmail.com';
    const password = 'testPassword';
    const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
    const link = 'https://fakeLink.fakeLink';
    const secret = process.env.SECRET;
    const userId = mongoose_1.default.Types.ObjectId();
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        mock_fs_1.default.restore();
        yield Tweet_1.default.deleteMany({}).exec();
        yield User_1.default.deleteMany({}).exec();
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield (0, connectToDB_1.default)(mongoURI);
        app_1.default.listen(port);
        yield Tweet_1.default.deleteMany({}).exec();
        yield User_1.default.deleteMany({}).exec();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    describe('get /tweets/:tweetId', () => {
        it('should get a tweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(2);
            const newTweet = new Tweet_1.default({
                type: 'text',
                text,
                user: userId,
            });
            yield newTweet.save();
            const tweetId = newTweet._id;
            const response = yield (0, supertest_1.default)(app_1.default).get(`/tweets/${tweetId}`);
            const { tweet } = response.body.data;
            expect(response.status).toBe(200);
            expect(tweet._id.toString()).toMatch(tweetId.toString());
        }));
        it('should throw an error with a status of 404: NotFound when the tweet is not found', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const response = yield (0, supertest_1.default)(app_1.default).get(`/tweets/${mongoose_1.default.Types.ObjectId()}`);
            expect(response.status).toBe(404);
        }));
    });
    describe('get /users/:userId/tweets', () => {
        it('should get a list of tweets', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const newTweet = new Tweet_1.default({
                type: 'text',
                text,
                user: userId,
            });
            yield newTweet.save();
            const response = yield (0, supertest_1.default)(app_1.default).get(`/users/${userId}/tweets`);
            expect(response.status).toBe(200);
        }));
    });
    describe('get /tweets', () => {
        it('should get a list of tweets', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const newTweet = new Tweet_1.default({
                type: 'text',
                text,
                user: userId,
            });
            yield newTweet.save();
            const response = yield (0, supertest_1.default)(app_1.default).get(`/tweets`);
            expect(response.status).toBe(200);
        }));
    });
    describe('get /tweets/:tweetId/replies', () => {
        it('should get a list of replies by tweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const tweetId = mongoose_1.default.Types.ObjectId().toString();
            const newReply = new Tweet_1.default({
                text,
                type: 'reply',
                user: userId,
                reply: tweetId,
            });
            yield newReply.save();
            const response = yield (0, supertest_1.default)(app_1.default).get(`/tweets/${tweetId}/replies`);
            expect(response.status).toBe(200);
        }));
    });
    describe('get /users/:userId/replies', () => {
        it('should get a list of replies by user', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const tweetId = mongoose_1.default.Types.ObjectId().toString();
            const newReply = new Tweet_1.default({
                text,
                type: 'reply',
                user: userId,
                reply: tweetId,
            });
            yield newReply.save();
            const response = yield (0, supertest_1.default)(app_1.default).get(`/users/${userId}/replies`);
            expect(response.status).toBe(200);
        }));
    });
});
