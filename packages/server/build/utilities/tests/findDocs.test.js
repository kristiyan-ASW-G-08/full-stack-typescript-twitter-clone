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
const findDocs_1 = __importDefault(require("@utilities/findDocs"));
const User_1 = __importDefault(require("@users/User"));
describe('findDocs', () => {
    afterEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());
    it(`should call all countDocuments, find, sort, skip, and limit`, () => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(9);
        const pagination = {
            page: 1,
            limit: 25,
            sortString: '-date',
            sort: 'new',
        };
        const limit = jest.fn();
        const skip = jest.fn(() => ({ limit }));
        const sort = jest.fn(() => ({ skip }));
        const find = jest.fn(() => ({
            sort,
        }));
        const findQuery = { user: 'user' };
        jest
            .spyOn(User_1.default, 'countDocuments')
            // @ts-ignore
            .mockReturnValue({ find });
        yield (0, findDocs_1.default)({
            model: User_1.default,
            pagination,
            query: findQuery,
        });
        expect(User_1.default.countDocuments).toHaveBeenCalledTimes(2);
        expect(find).toHaveBeenCalledTimes(1);
        expect(find).toHaveBeenCalledWith(findQuery);
        expect(sort).toHaveBeenCalledTimes(1);
        expect(sort).toHaveBeenCalledWith(pagination.sortString);
        expect(skip).toHaveBeenCalledTimes(1);
        expect(skip).toHaveBeenCalledWith((pagination.page - 1) * pagination.limit);
        expect(limit).toHaveBeenCalledTimes(1);
        expect(limit).toHaveBeenCalledWith(pagination.limit);
    }));
});
