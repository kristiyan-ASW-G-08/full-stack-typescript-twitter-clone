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
const app_1 = __importDefault(require("src/app"));
const User_1 = __importDefault(require("src/users/User"));
const connectToDB_1 = __importDefault(require("@utilities/connectToDB"));
const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
jest.mock('mjml');
describe('userRoutes', () => {
    const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
    const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
        yield connectToDB_1.default(mongoURI);
        app_1.default.listen(port);
        yield User_1.default.deleteMany({}).exec();
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
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
    describe('/users', () => {
        it('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
            expect.assertions(1);
            const response = yield supertest_1.default(app_1.default)
                .post('/users')
                .send({
                username,
                handle,
                email,
                password,
                confirmPassword: password,
            });
            expect(response.status).toBe(201);
        }));
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const response = yield supertest_1.default(app_1.default)
            .post('/users')
            .send({
            username,
            handle,
            email: invalidEmail,
            password: invalidPassword,
            confirmPassword: password,
        });
        expect(response.status).toBe(400);
        expect(response.body).toMatchSnapshot();
        // expect(sendEmail).not.toHaveBeenCalled();
    }));
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const response = yield supertest_1.default(app_1.default).post('/users');
        expect(response.status).toBe(400);
        expect(response.body).toMatchSnapshot();
        // expect(sendEmail).not.toHaveBeenCalled();
    }));
    it('should throw an error with a status of 409: Conflict when the user credentials are already taken', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        yield User_1.default.insertMany({ username, handle, email, password });
        const response = yield supertest_1.default(app_1.default)
            .post('/users')
            .send({
            username,
            handle,
            email,
            password,
            confirmPassword: password,
        });
        expect(response.status).toBe(409);
        // expect(sendEmail).not.toHaveBeenCalled();
    }));
});
