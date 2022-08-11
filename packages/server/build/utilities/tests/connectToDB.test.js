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
const connectToDB_1 = __importDefault(require("@utilities/connectToDB"));
const logger_1 = __importDefault(require("@utilities/logger"));
jest.mock('mongoose');
jest.mock('@utilities/logger');
const loggerMock = logger_1.default;
const mongooseMock = mongoose_1.default;
const mongoURI = 'mongoURL';
describe('connectToDB', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    }));
    it('should connect to mongodb', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(4);
        yield expect(connectToDB_1.default(mongoURI)).resolves.toBeUndefined();
        expect(mongooseMock.connect).toHaveBeenCalledTimes(1);
        expect(mongooseMock.connect).toHaveBeenCalledWith(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        expect(loggerMock.error).not.toHaveBeenCalled();
    }));
    it('should not connect to mongodb', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(4);
        mongooseMock.connect.mockRejectedValueOnce(new Error('Connection Error'));
        yield expect(connectToDB_1.default(mongoURI)).resolves.toBeUndefined();
        expect(mongooseMock.connect).toHaveBeenCalledTimes(1);
        expect(mongooseMock.connect).toHaveBeenCalledWith(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        expect(loggerMock.error).toHaveBeenCalledTimes(1);
    }));
});
