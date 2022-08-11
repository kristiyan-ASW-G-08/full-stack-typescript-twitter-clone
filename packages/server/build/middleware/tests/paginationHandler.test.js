"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const paginationHandler_1 = __importDefault(require("@src/middleware/paginationHandler"));
describe('paginationHandler', () => {
    afterEach(() => jest.clearAllMocks());
    const sortArr = [
        { sort: 'top', sortString: '-likes' },
        { sort: 'trending', sortString: '-retweets' },
        { sort: 'new', sortString: '-date' },
        { sort: 'replies', sortString: '-replies' },
    ];
    const limitArr = [25, 30, 35, 40, 45, 50];
    it.each(sortArr)('should return the proper sort string', ({ sort, sortString }) => {
        expect.assertions(2);
        const nextMock = jest.fn();
        const reqMock = node_mocks_http_1.default.createRequest({
            method: 'GET',
            url: '/',
            query: {
                sort,
            },
        });
        const resMock = node_mocks_http_1.default.createResponse();
        (0, paginationHandler_1.default)(reqMock, resMock, nextMock);
        expect(nextMock).toBeCalledTimes(1);
        expect(reqMock.pagination).toEqual({
            limit: 25,
            page: 1,
            sort,
            sortString,
        });
    });
    it.each(limitArr)('should return the proper limit', (limit) => {
        expect.assertions(2);
        const nextMock = jest.fn();
        const reqMock = node_mocks_http_1.default.createRequest({
            method: 'GET',
            url: '/',
            query: {
                limit,
            },
        });
        const resMock = node_mocks_http_1.default.createResponse();
        (0, paginationHandler_1.default)(reqMock, resMock, nextMock);
        expect(nextMock).toBeCalledTimes(1);
        expect(reqMock.pagination).toEqual({
            limit,
            page: 1,
            sort: 'new',
            sortString: '-date',
        });
    });
});
