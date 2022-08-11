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
const RESTError_1 = __importDefault(require("@utilities/RESTError"));
const User_1 = __importDefault(require("@users/User"));
const getResource_1 = __importDefault(require("@utilities/getResource"));
jest.mock('@utilities/RESTError');
const RESTErrorMock = RESTError_1.default;
describe('getResource', () => {
    expect.assertions(5);
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.restoreAllMocks());
    it('should call find and select', () => __awaiter(void 0, void 0, void 0, function* () {
        const select = jest.fn(() => true);
        const findQuery = { name: 'email', value: 'testMail@test' };
        const selectQuery = 'username email';
        const findOneSpy = jest
            .spyOn(User_1.default, 'findOne')
            // @ts-ignore
            .mockReturnValue({ select });
        yield (0, getResource_1.default)(User_1.default, findQuery, selectQuery);
        expect(findOneSpy).toHaveBeenCalledTimes(1);
        expect(findOneSpy).toHaveBeenCalledWith({
            [findQuery.name]: findQuery.value,
        });
        expect(select).toHaveBeenCalledTimes(1);
        expect(select).toHaveBeenCalledWith(selectQuery);
        expect(RESTErrorMock).not.toHaveBeenCalled();
    }));
    it('should throw an error if find and select resolve to falsy value', () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(2);
        const select = jest.fn(() => false);
        const findQuery = { name: 'email', value: 'testMail@test' };
        const selectQuery = 'username email';
        const findOneSpy = jest
            .spyOn(User_1.default, 'findOne')
            // @ts-ignore
            .mockReturnValue({ select });
        RESTErrorMock.mockImplementation((status, message, data) => ({
            status,
            message,
            data,
            name: 'error',
        }));
        yield expect((0, getResource_1.default)(User_1.default, findQuery, selectQuery)).rejects.toThrowErrorMatchingSnapshot();
        expect(RESTErrorMock).toHaveBeenCalledTimes(1);
    }));
});
