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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const User_1 = __importDefault(require("@users/User"));
const Tweet_1 = __importDefault(require("@tweets/Tweet"));
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
const tweetTemplates = {
    1: `{{lorem.paragraph}},{{image.imageUrl}}`,
    2: `{{lorem.sentences}}`,
    3: `{{lorem.paragraph}},{{image.imageUrl}}`,
    4: `{{lorem.paragraph}},{{image.imageUrl}}`,
    5: `{{lorem.sentence}}`,
    6: `{{lorem.paragraph}},{{image.imageUrl}}`,
    7: `{{lorem.paragraph}}`,
    8: `{{lorem.paragraph}},{{image.imageUrl}}`,
    9: `{{lorem.word}},{{image.imageUrl}}`,
};
const populateDB = () => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const usersNum = 30;
    const users = new Array(usersNum)
        .fill(null)
        .map(e => {
        return faker_1.default
            .fake(`{{internet.userName}},{{internet.userName}},{{internet.exampleEmail}},
        {{internet.password}},{{image.avatar}},{{image.imageUrl}} `)
            .split(',');
    })
        .map(([username, handle, email, password, avatar, cover]) => {
        return { username, handle, email, password, avatar, cover };
    });
    const userDocuments = yield User_1.default.insertMany(users);
    try {
        for (var userDocuments_1 = __asyncValues(userDocuments), userDocuments_1_1; userDocuments_1_1 = yield userDocuments_1.next(), !userDocuments_1_1.done;) {
            const user = userDocuments_1_1.value;
            const ids = userDocuments
                .filter(userDocument => userDocument._id.toString() !== user._id.toString())
                .map(({ _id }) => _id);
            user.following = [...ids];
            user.followers = usersNum - 1;
            yield user.save();
            const tweets = new Array(10)
                .fill(null)
                .map((e, index) => {
                const num = getRandomInt(1, 9);
                // @ts-ignore
                return faker_1.default.fake(tweetTemplates[num]).split(',');
            })
                .map(([text, image]) => {
                if (image) {
                    return { text, image, type: 'text', user: user._id };
                }
                return { text, type: 'text', user: user._id };
            });
            yield Tweet_1.default.insertMany(tweets);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (userDocuments_1_1 && !userDocuments_1_1.done && (_a = userDocuments_1.return)) yield _a.call(userDocuments_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    console.log(userDocuments);
});
exports.default = populateDB;
