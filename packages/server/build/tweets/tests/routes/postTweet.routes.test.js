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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mock_fs_1 = __importDefault(require("mock-fs"));
const mjml_1 = __importDefault(require("mjml"));
const app_1 = __importDefault(require("src/app"));
const User_1 = __importDefault(require("src/users/User"));
const connectToDB_1 = __importDefault(require("@utilities/connectToDB"));
const Tweet_1 = __importDefault(require("src/tweets/Tweet"));
jest.mock('@utilities/uploadToCloudinary', () => jest.fn(() => Promise.resolve({ public_id: 'public_id' })));
jest.mock('@utilities/deleteFromCloudinary');
const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
mjml_1.default.mockReturnValue(mockTemplate);
jest.mock('mjml');
describe('tweetRoutes', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testmail@mail.com';
    const password = 'testPassword';
    const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
    const link = 'https://fakeLink.fakeLink';
    const secret = process.env.SECRET;
    let token;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.deleteMany({}).exec();
        const user = new User_1.default({
            username,
            handle,
            email,
            password,
        });
        yield user.save();
        token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, secret, { expiresIn: '1h' });
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        mock_fs_1.default.restore();
        yield Tweet_1.default.deleteMany({}).exec();
        yield User_1.default.deleteMany({}).exec();
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield connectToDB_1.default(mongoURI);
        app_1.default.listen(port);
        yield Tweet_1.default.deleteMany({}).exec();
        yield User_1.default.deleteMany({}).exec();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    describe('post /tweets', () => {
        it('should create a new text tweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const type = 'text';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .send({
                type,
                text,
            })
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(201);
        }));
        it('should create a new link tweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const type = 'link';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .send({
                type,
                linkUrl: link,
            })
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(201);
        }));
        it('should create a new retweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const tweet = new Tweet_1.default({
                type: 'link',
                link,
                user: mongoose_1.default.Types.ObjectId(),
            });
            yield tweet.save();
            const retweetId = tweet._id;
            const type = 'retweet';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .send({
                type,
                text,
                retweetId,
            })
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(201);
        }));
        it('should create a new reply tweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const tweet = new Tweet_1.default({
                type: 'link',
                link,
                user: mongoose_1.default.Types.ObjectId(),
            });
            yield tweet.save();
            const replyId = tweet._id;
            const type = 'reply';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .send({
                type,
                text,
                replyId,
            })
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(201);
        }));
        it('should create a new image tweet', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            mock_fs_1.default({
                './images': {
                    'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
                },
            });
            const type = 'text';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .field({
                type,
                text,
            })
                .attach('image', './images/test.jpg')
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(201);
        }));
        it("should throw an error with a status of 400: BadRequest when the tweet type and the content don't match", () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const type = 'retweet';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .send({
                type,
                text,
            })
                .set('Authorization', `Bearer ${token}`);
            expect(response.status).toBe(400);
        }));
        it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const type = 'text';
            const response = yield supertest_1.default(app_1.default)
                .post('/tweets')
                .send({
                type,
                text,
            });
            expect(response.status).toBe(401);
        }));
    });
});
