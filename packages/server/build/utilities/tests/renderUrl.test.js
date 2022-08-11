"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const renderUrl_1 = __importDefault(require("@utilities/renderUrl"));
describe('renderUrl', () => {
    const sortArr = [
        {
            urlExtension: 'tweets',
            queries: { limit: 25, page: 1, sort: 'top' },
            urlResult: `${process.env.PORT}/tweets?limit=25&page=1&sort=top`,
        },
        {
            urlExtension: 'users/tweets/tweetId',
            queries: undefined,
            urlResult: `${process.env.PORT}/users/tweets/tweetId`,
        },
    ];
    it.each(sortArr)('should return the correct url', ({ urlExtension, queries, urlResult }) => {
        expect.assertions(1);
        expect((0, renderUrl_1.default)(urlExtension, queries)).toMatch(urlResult);
    });
});
