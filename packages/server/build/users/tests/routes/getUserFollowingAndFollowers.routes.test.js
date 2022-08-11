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
const mjml_1 = __importDefault(require("mjml"));
const app_1 = __importDefault(require("src/app"));
const User_1 = __importDefault(require("src/users/User"));
const Tweet_1 = __importDefault(require("src/tweets/Tweet"));
const connectToDB_1 = __importDefault(require("@utilities/connectToDB"));
jest.mock('@utilities/uploadToCloudinary');
jest.mock('@utilities/deleteFromCloudinary');
const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
mjml_1.default.mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('@utilities/sendEmail');
describe('userRoutes', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield connectToDB_1.default(mongoURI);
        app_1.default.listen(port);
        yield Tweet_1.default.deleteMany({}).exec();
        yield User_1.default.deleteMany({}).exec();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield Tweet_1.default.deleteMany({}).exec();
        yield User_1.default.deleteMany({}).exec();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testmail@mail.com';
    const password = 'testPassword';
    const invalidEmail = 'testmail';
    const invalidPassword = '1234';
    const text = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
    const secret = process.env.SECRET;
    describe('', () => {
        let testUser;
        beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
            testUser = new User_1.default({
                username,
                handle,
                email,
                password,
                isConfirmed: true,
            });
            yield testUser.save();
        }));
        afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
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
        describe('get /users/:userId/following ', () => {
            it('should get a list of users', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(3);
                const followedUser = new User_1.default({
                    username: 'followedUser',
                    handle: 'followedUserHandle',
                    email: 'followedUserMail@mail.com',
                    password,
                });
                yield followedUser.save();
                const followedUserId = followedUser._id.toString();
                testUser.following = [followedUserId];
                yield testUser.save();
                const userId = testUser._id;
                const response = yield supertest_1.default(app_1.default).get(`/users/${userId}/following`);
                const { users } = response.body.data;
                expect(response.status).toBe(200);
                expect(users).toHaveLength(1);
                expect(users[0]._id).toMatch(followedUserId);
            }));
            it('should throw an error with a status of 404: NotFound when the user is not found', () => __awaiter(void 0, void 0, void 0, function* () {
                expect.assertions(1);
                const userId = mongoose_1.default.Types.ObjectId();
                const token = jsonwebtoken_1.default.sign({
                    userId,
                }, secret, { expiresIn: '1h' });
                const response = yield supertest_1.default(app_1.default).get(`/users/${userId}/following`);
                expect(response.status).toBe(404);
            }));
        });
        describe('get /users/:userId/followers ', () => {
            it('should get a list of users', () => __awaiter(void 0, void 0, void 0, function* () {
                // expect.assertions(3);
                const followedUser = new User_1.default({
                    username: 'followedUser',
                    handle: 'followedUserHandle',
                    email: 'followedUserMail@mail.com',
                    password,
                });
                yield followedUser.save();
                const followedUserId = followedUser._id.toString();
                testUser.following = [followedUserId];
                yield testUser.save();
                const userId = testUser._id;
                const response = yield supertest_1.default(app_1.default).get(`/users/${followedUserId}/followers`);
                const { users } = response.body.data;
                expect(response.status).toBe(200);
                expect(users).toHaveLength(1);
                expect(users[0]._id).toMatch(userId.toString());
            }));
        });
    });
});
