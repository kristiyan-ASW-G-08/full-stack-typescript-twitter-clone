"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getPaginationURLs_1 = __importDefault(require("@src/utilities/getPaginationURLs"));
const renderUrl_1 = __importDefault(require("@utilities/renderUrl"));
jest.mock('@utilities/renderUrl');
const renderUrlMock = renderUrl_1.default;
describe('getPaginationURLs', () => {
    const sortArr = [
        {
            count: 10,
            page: 1,
            urlExtension: 'tweets',
            queries: { limit: 25, page: 1, sort: 'top' },
            urlResult: `${process.env.PORT}/tweets?limit=25&page=1&sort=top`,
            prevPage: null,
            nextPage: `${process.env.PORT}/tweets?limit=25&page=2&sort=top`,
        },
        {
            count: 0,
            page: 10,
            urlExtension: 'users/tweets/tweetId',
            queries: { limit: 25, page: 1, sort: 'top' },
            urlResult: `${process.env.PORT}/users/tweets/tweetId`,
            prevPage: null,
            nextPage: null,
        },
    ];
    it.each(sortArr)('should return the correct next and previous pages', ({ urlExtension, queries, prevPage, nextPage, count, page }) => {
        expect.assertions(1);
        // @ts-ignore
        renderUrlMock.mockReturnValueOnce(nextPage).mockReturnValueOnce(prevPage);
        expect((0, getPaginationURLs_1.default)({ count, page, queries, urlExtension })).toStrictEqual({ nextPage, prevPage });
    });
});
