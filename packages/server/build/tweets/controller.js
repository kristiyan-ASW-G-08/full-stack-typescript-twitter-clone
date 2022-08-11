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
exports.getUserReplies = exports.getReplies = exports.getUserTweets = exports.getAllTweets = exports.getTweet = exports.deleteTweet = exports.patchTweet = exports.postTweet = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Tweet_1 = __importDefault(require("./Tweet"));
const services_1 = require("./services");
const passErrorToNext_1 = __importDefault(require("../utilities/passErrorToNext"));
const isAuthorized_1 = __importDefault(require("../utilities/isAuthorized"));
const deleteFile_1 = __importDefault(require("../utilities/deleteFile"));
const includesId_1 = __importDefault(require("../utilities/includesId"));
const removeId_1 = __importDefault(require("../utilities/removeId"));
const services_2 = require("../users/services");
const findDocs_1 = __importDefault(require("../utilities/findDocs"));
const getPaginationURLs_1 = __importDefault(require("../utilities/getPaginationURLs"));
const uploadToCloudinary_1 = __importDefault(require("../utilities/uploadToCloudinary"));
const deleteFromCloudinary_1 = __importDefault(require("../utilities/deleteFromCloudinary"));
const postTweet = ({ userId, body: { text, linkUrl, type, retweetId, replyId }, file }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, services_2.getUserById)(userId);
        const tweet = new Tweet_1.default({
            text,
            user: userId,
            type,
            link: linkUrl,
        });
        if (file) {
            const { path, filename } = file;
            tweet.image = (yield (0, uploadToCloudinary_1.default)(path, filename)).public_id;
            (0, deleteFile_1.default)(path);
        }
        if (retweetId) {
            const retweetedTweet = yield (0, services_1.getTweetById)(retweetId);
            tweet.retweet = retweetId;
            if ((0, includesId_1.default)(user.retweets, retweetId)) {
                user.retweets = (0, removeId_1.default)(user.retweets, retweetId);
                retweetedTweet.retweets -= 1;
            }
            else {
                user.retweets = [...user.retweets, mongoose_1.default.Types.ObjectId(retweetId)];
                retweetedTweet.retweets += 1;
            }
            yield retweetedTweet.save();
        }
        if (replyId) {
            const replyTweet = yield (0, services_1.getTweetById)(replyId);
            tweet.reply = replyId;
            if ((0, includesId_1.default)(user.replies, replyId)) {
                user.replies = (0, removeId_1.default)(user.replies, replyId);
                replyTweet.replies -= 1;
            }
            else {
                user.replies = [...user.replies, mongoose_1.default.Types.ObjectId(replyId)];
                replyTweet.replies += 1;
            }
            yield replyTweet.save();
        }
        yield tweet.save();
        yield user.save();
        res.status(201).json({ data: { tweetId: tweet._id } });
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.postTweet = postTweet;
const patchTweet = ({ userId, body: { text, linkUrl }, params: { tweetId }, file }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield (0, services_1.getTweetById)(tweetId);
        (0, isAuthorized_1.default)(tweet.user.toString(), userId);
        tweet.text = text;
        tweet.link = linkUrl;
        if (tweet.image && file) {
            const { path, filename } = file;
            yield (0, deleteFromCloudinary_1.default)(tweet.image);
            tweet.image = (yield (0, uploadToCloudinary_1.default)(path, filename)).public_id;
            (0, deleteFile_1.default)(path);
        }
        yield tweet.save();
        res.sendStatus(204);
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.patchTweet = patchTweet;
const deleteTweet = ({ params: { tweetId }, userId }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield (0, services_1.getTweetById)(tweetId);
        (0, isAuthorized_1.default)(tweet.user.toString(), userId);
        const user = yield (0, services_2.getUserById)(tweet.user, false);
        if (tweet.image) {
            yield (0, deleteFromCloudinary_1.default)(tweet.image);
        }
        if (tweet.type === 'reply') {
            const repliedToTweet = yield (0, services_1.getTweetById)(tweet.reply);
            user.replies = (0, removeId_1.default)(user.replies, tweet.reply);
            repliedToTweet.replies -= 1;
            yield repliedToTweet.save();
        }
        if (tweet.type === 'retweet') {
            const repliedToTweet = yield (0, services_1.getTweetById)(tweet.reply);
            user.retweets = (0, removeId_1.default)(user.retweets, tweet.reply);
            repliedToTweet.retweets -= 1;
            yield repliedToTweet.save();
        }
        yield tweet.remove();
        res.sendStatus(204);
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.deleteTweet = deleteTweet;
const getTweet = ({ params: { tweetId } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tweet = yield (0, services_1.getTweetById)(tweetId);
        const populatedTweet = yield tweet
            .populate([
            { path: 'user', select: 'username handle avatar' },
            { path: 'reply', select: 'user' },
            { path: 'retweet' },
        ])
            .execPopulate();
        res.status(200).json({ data: { tweet: populatedTweet } });
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.getTweet = getTweet;
const getAllTweets = ({ pagination }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, sort } = pagination;
        const { documents, count } = yield (0, findDocs_1.default)({
            model: Tweet_1.default,
            pagination,
            query: {},
        });
        const { prevPage, nextPage } = (0, getPaginationURLs_1.default)({
            page,
            urlExtension: 'tweets',
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                tweets: documents,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.getAllTweets = getAllTweets;
const getUserTweets = ({ params: { userId }, pagination }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, sort } = pagination;
        const { documents, count } = yield (0, findDocs_1.default)({
            model: Tweet_1.default,
            pagination,
            query: { user: userId },
        });
        const { prevPage, nextPage } = (0, getPaginationURLs_1.default)({
            page,
            urlExtension: `users/${userId}/tweets`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                tweets: documents,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.getUserTweets = getUserTweets;
const getReplies = ({ params: { tweetId }, pagination }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, sort } = pagination;
        const { documents, count } = yield (0, findDocs_1.default)({
            model: Tweet_1.default,
            pagination,
            query: { reply: tweetId },
        });
        const { prevPage, nextPage } = (0, getPaginationURLs_1.default)({
            page,
            urlExtension: `tweets/${tweetId}/replies`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                tweets: documents,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.getReplies = getReplies;
const getUserReplies = ({ params: { userId }, pagination }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, sort } = pagination;
        const { documents, count } = yield (0, findDocs_1.default)({
            model: Tweet_1.default,
            pagination,
            query: { user: userId, type: 'reply' },
        });
        const { prevPage, nextPage } = (0, getPaginationURLs_1.default)({
            page,
            urlExtension: `users/${userId}/replies`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                tweets: documents,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        (0, passErrorToNext_1.default)(err, next);
    }
});
exports.getUserReplies = getUserReplies;
