"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getSortString_1 = __importDefault(require("utilities/getSortString"));
describe('getSortString', () => {
    const sortArr = [
        { sortKey: 'top', sortString: '-likes' },
        { sortKey: 'trending', sortString: '-retweets' },
        { sortKey: 'new', sortString: '-date' },
        { sortKey: 'replies', sortString: '-replies' },
    ];
    it.each(sortArr)('should return the proper sort string', ({ sortKey, sortString }) => {
        expect.assertions(1);
        expect((0, getSortString_1.default)(sortKey)).toMatch(sortString);
    });
});
