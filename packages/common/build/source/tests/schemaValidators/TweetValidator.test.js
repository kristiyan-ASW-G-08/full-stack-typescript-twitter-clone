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
const TweetValidator_1 = __importDefault(require("@schemaValidators/TweetValidator"));
describe('TweetValidator', () => {
    const validTweets = [
        {
            type: 'text',
            text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.',
        },
        {
            type: 'link',
            text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.',
            linkUrl: 'https://fakeLink.fakeLink',
        },
        {
            type: 'retweet',
            text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.',
            retweetId: 'mockId',
        },
        {
            type: 'reply',
            replyId: 'mockId',
        },
    ];
    const invalidTweets = [
        {
            type: 'invalid',
            text: 10,
        },
        {
            type: 'link',
            text: '',
            linkUrl: "not a url'",
        },
    ];
    it.each(validTweets)('should validate successfully', (tweet) => __awaiter(void 0, void 0, void 0, function* () {
        expect.assertions(1);
        yield expect(TweetValidator_1.default.validate(tweet, { abortEarly: false })).resolves.toBe(tweet);
    }));
    it.each(invalidTweets)('should validate unsuccessfully', (tweet) => __awaiter(void 0, void 0, void 0, function* () {
        // expect.assertions(1);
        yield expect(TweetValidator_1.default.validate(tweet, { abortEarly: false })).rejects.toMatchSnapshot();
    }));
});
