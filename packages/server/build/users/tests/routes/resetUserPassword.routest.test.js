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
const User_1 = __importDefault(require("users/User"));
const connectToDB_1 = __importDefault(require("utilities/connectToDB"));
const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
mjml_1.default.mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('utilities/sendEmail');
describe('userRoutes', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    const username = 'username';
    const handle = 'testUserHandle';
    const email = 'testmailmail.com';
    const password = 'testPassword';
    let testUser;
    const secret = process.env.SECRET;
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
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield (0, connectToDB_1.default)(mongoURI);
        app_1.default.listen(port);
        yield User_1.default.deleteMany({}).exec();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield User_1.default.deleteMany({}).exec();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    describe('patch /users/user/reset', () => {
        it("should reset user's password", () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const userId = testUser._id;
            const newPassword = 'newPasswordNewPassword';
            const token = jsonwebtoken_1.default.sign({
                userId,
            }, secret, { expiresIn: '1h' });
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/users/user/reset`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                password: newPassword,
                confirmPassword: newPassword,
            });
            expect(response.status).toBe(204);
        }));
        it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const userId = testUser._id;
            const newPassword = 'invalid';
            const token = jsonwebtoken_1.default.sign({
                userId,
            }, secret, { expiresIn: '1h' });
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/users/user/reset`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                password: newPassword,
                confirmPassword: newPassword,
            });
            expect(response.status).toBe(400);
        }));
        it("should throw an error with a status of 404: NotFound when the user doesn't exist", () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const userId = mongoose_1.default.Types.ObjectId();
            const newPassword = 'newPasswordNewPassword';
            const token = jsonwebtoken_1.default.sign({
                userId,
            }, secret, { expiresIn: '1h' });
            const response = yield (0, supertest_1.default)(app_1.default)
                .patch(`/users/user/reset`)
                .set('Authorization', `Bearer ${token}`)
                .send({
                password: newPassword,
                confirmPassword: newPassword,
            });
            expect(response.status).toBe(404);
        }));
    });
});
