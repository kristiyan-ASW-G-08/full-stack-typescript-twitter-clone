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
exports.getUserFollowers = exports.getUserFollowing = exports.getUser = exports.getUserFeed = exports.getUsersList = exports.patchProfile = exports.getUserLikes = exports.getUserBookmarks = exports.followUser = exports.likeTweet = exports.bookmarkTweet = exports.deleteUser = exports.resetPassword = exports.requestPasswordResetEmail = exports.verifyEmail = exports.logIn = exports.signUp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mjml_1 = __importDefault(require("mjml"));
const services_1 = require("src/users/services");
const services_2 = require("src/tweets/services");
const passErrorToNext_1 = __importDefault(require("@utilities/passErrorToNext"));
const includesId_1 = __importDefault(require("@src/utilities/includesId"));
const removeId_1 = __importDefault(require("@utilities/removeId"));
const User_1 = __importDefault(require("src/users/User"));
const Tweet_1 = __importDefault(require("src/tweets/Tweet"));
const RESTError_1 = require("@utilities/RESTError");
const sendEmail_1 = __importDefault(require("@utilities/sendEmail"));
const findDocs_1 = __importDefault(require("@utilities/findDocs"));
const hasConfirmedEmail_1 = __importDefault(require("@utilities/hasConfirmedEmail"));
const getPaginationURLs_1 = __importDefault(require("@utilities/getPaginationURLs"));
const uploadToCloudinary_1 = __importDefault(require("@src/utilities/uploadToCloudinary"));
const deleteFromCloudinary_1 = __importDefault(require("@src/utilities/deleteFromCloudinary"));
const deleteFile_1 = __importDefault(require("@src/utilities/deleteFile"));
const duplicationErrorHandler_1 = __importDefault(require("@src/middleware/duplicationErrorHandler"));
exports.signUp = ({ body: { username, handle, email, password } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new User_1.default({
            username,
            handle,
            email,
            password: yield bcryptjs_1.default.hash(password, 12),
        })
            .save()
            .catch(err => duplicationErrorHandler_1.default(err, res));
        res.sendStatus(201);
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.logIn = ({ body: { email, password } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { SECRET } = process.env;
        const user = yield services_1.getUserByEmail(email);
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            const { status } = RESTError_1.errors.Unauthorized;
            res.status(status).send({
                data: [
                    {
                        path: 'password',
                        message: 'Wrong password. Try again',
                    },
                ],
            });
        }
        hasConfirmedEmail_1.default(user.isConfirmed);
        const token = jsonwebtoken_1.default.sign({
            userId: user._id,
        }, SECRET, { expiresIn: '1h' });
        const { username, handle, following, likes, bookmarks, date, replies, retweets, _id, cover, avatar, } = user;
        res.status(200).json({
            data: {
                token,
                user: {
                    username,
                    handle,
                    following,
                    likes,
                    bookmarks,
                    email,
                    date,
                    replies,
                    retweets,
                    _id,
                    cover,
                    avatar,
                },
            },
        });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.verifyEmail = ({ params: { token } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // @ts-ignore
        const { userId } = jsonwebtoken_1.default.verify(token, process.env.SECRET);
        const user = yield services_1.getUserById(userId);
        user.isConfirmed = true;
        yield user.save();
        res.sendStatus(204);
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.requestPasswordResetEmail = ({ body: { email } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, isConfirmed } = yield services_1.getUserByEmail(email);
        hasConfirmedEmail_1.default(isConfirmed);
        const { EMAIL, CLIENT_URL, SECRET } = process.env;
        const token = jsonwebtoken_1.default.sign({
            userId: _id,
        }, SECRET, { expiresIn: '1h' });
        const url = `${CLIENT_URL}/reset/${token}`;
        const validationLevel = 'strict';
        const options = {
            validationLevel,
        };
        const htmlOutput = mjml_1.default(`
      <mjml>
      <mj-head>
        <mj-attributes>
          <mj-class name="dark" color="#4f4f4f" />
          <mj-class name="primary" color="#1dcaff" />
          <mj-class name="primary-bg" background-color="#1dcaff" />
          <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
          <mj-all font-family="Roboto" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-hero mode="fixed-height" height="370px" padding="10px 40px 10px 40px">
          <mj-text align="center" font-size="25px" font-weight="900" mj-class="primary">
            TwittClone
          </mj-text>
          <mj-text align="left" mj-class="dark" font-size="15px" line-height="20px">
            If you haven't requested password reset, you can ignore this email.
          </mj-text>
          <mj-button mj-class="primary-bg" href="${url}" align="center">
          Reset Your Password
          </mj-button>
        </mj-hero>
      </mj-body>
    </mjml>
  `, options);
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: 'TwittClone Password Reset',
            html: htmlOutput.html,
        };
        sendEmail_1.default(mailOptions);
        res.sendStatus(204);
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.resetPassword = ({ userId, body: { password } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId);
        user.password = yield bcryptjs_1.default.hash(password, 12);
        yield user.save();
        res.sendStatus(204);
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.deleteUser = ({ userId }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (yield services_1.getUserById(userId)).remove();
        res.sendStatus(204);
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.bookmarkTweet = ({ userId, params: { tweetId } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId, false);
        if (!includesId_1.default(user.bookmarks, tweetId)) {
            user.bookmarks = [...user.bookmarks, mongoose_1.default.Types.ObjectId(tweetId)];
        }
        else {
            user.bookmarks = removeId_1.default(user.bookmarks, tweetId);
        }
        yield user.save();
        res.status(200).json({ data: { user } });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.likeTweet = ({ userId, params: { tweetId } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId, false);
        const tweet = yield services_2.getTweetById(tweetId);
        if (includesId_1.default(user.likes, tweetId)) {
            user.likes = removeId_1.default(user.likes, tweetId);
            tweet.likes -= 1;
        }
        else {
            user.likes = [...user.likes, mongoose_1.default.Types.ObjectId(tweetId)];
            tweet.likes += 1;
        }
        yield tweet.save();
        yield user.save();
        res.status(200).json({ data: { user } });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.followUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const authenticatedUserId = req.userId;
        const user = yield services_1.getUserById(userId, false);
        const authenticatedUser = yield services_1.getUserById(authenticatedUserId);
        if (includesId_1.default(authenticatedUser.following, userId)) {
            authenticatedUser.following = removeId_1.default(authenticatedUser.following, userId);
            user.followers -= 1;
        }
        else {
            authenticatedUser.following = [
                ...authenticatedUser.following,
                mongoose_1.default.Types.ObjectId(userId),
            ];
            user.followers += 1;
        }
        yield user.save();
        yield authenticatedUser.save();
        res.status(200).json({ data: { user: authenticatedUser } });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.getUserBookmarks = ({ userId, pagination: { page, limit, sort, sortString } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId);
        const populatedUser = yield user
            .populate({
            path: 'bookmarks',
            options: {
                sort: sortString,
                skip: (page - 1) * limit,
                limit,
            },
        })
            .execPopulate();
        const { bookmarks } = populatedUser;
        const count = bookmarks.length - page * limit;
        const { prevPage, nextPage } = getPaginationURLs_1.default({
            page,
            urlExtension: `users/user/bookmarks`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                tweets: bookmarks,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.getUserLikes = ({ pagination: { page, limit, sort, sortString }, params: { userId }, }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId);
        const populatedUser = yield user
            .populate({
            path: 'likes',
            options: {
                sort: sortString,
                skip: (page - 1) * limit,
                limit,
            },
        })
            .execPopulate();
        const { likes } = populatedUser;
        const count = likes.length - page * limit;
        const { prevPage, nextPage } = getPaginationURLs_1.default({
            page,
            urlExtension: `users/${userId}/likes`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                tweets: likes,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.patchProfile = ({ body: { username, handle }, userId, files }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId, false);
        if (!Array.isArray(files) && files && files.avatar) {
            const { filename, path } = files.avatar[0];
            if (user.avatar) {
                yield deleteFromCloudinary_1.default(user.avatar);
            }
            user.avatar = (yield uploadToCloudinary_1.default(path, filename)).public_id;
            deleteFile_1.default(path);
        }
        if (!Array.isArray(files) && files && files.cover) {
            const { filename, path } = files.cover[0];
            if (user.cover) {
                yield deleteFromCloudinary_1.default(user.cover);
            }
            user.cover = (yield uploadToCloudinary_1.default(path, filename)).public_id;
            deleteFile_1.default(path);
        }
        user.username = username;
        user.handle = handle;
        yield user.save();
        res.status(200).json({ data: { user } });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.getUsersList = ({ params: { handle } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const searchRegex = new RegExp(handle, 'gi');
        const users = yield User_1.default.find({
            handle: { $regex: searchRegex },
        }, 'username handle avatar cover')
            .select([
            { $match: { $text: { $search: 'Pattern' } } },
            { score: { $meta: 'textScore' } },
        ])
            .limit(10)
            .exec();
        res.status(200).json({ data: { users } });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.getUserFeed = ({ userId, pagination }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, sort } = pagination;
        const { following } = yield services_1.getUserById(userId);
        const { documents, count } = yield findDocs_1.default({
            model: Tweet_1.default,
            pagination,
            query: { user: { $in: following } },
        });
        const { prevPage, nextPage } = getPaginationURLs_1.default({
            page,
            urlExtension: `users/user/tweets`,
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
        passErrorToNext_1.default(err, next);
    }
});
exports.getUser = ({ params: { userId } }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId, false);
        res.status(200).json({
            data: {
                user,
            },
        });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.getUserFollowing = ({ params: { userId }, pagination: { page, limit, sort, sortString }, }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield services_1.getUserById(userId);
        const populatedUser = yield user
            .populate({
            path: 'following',
            options: {
                sort: sortString,
                skip: (page - 1) * limit,
                limit,
                select: 'username handle avatar cover website following followers',
            },
        })
            .execPopulate();
        const { following } = populatedUser;
        const count = following.length - page * limit;
        const { prevPage, nextPage } = getPaginationURLs_1.default({
            page,
            urlExtension: `users/${userId}/following?`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                users: following,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
exports.getUserFollowers = ({ params: { userId }, pagination }, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page, limit, sort } = pagination;
        const { documents, count } = yield findDocs_1.default({
            model: User_1.default,
            pagination,
            query: {
                following: { $in: [userId] },
            },
        });
        const { prevPage, nextPage } = getPaginationURLs_1.default({
            page,
            urlExtension: `users/${userId}/followers?`,
            count,
            queries: {
                limit,
                sort,
            },
        });
        res.status(200).json({
            data: {
                users: documents,
                links: {
                    next: nextPage,
                    prev: prevPage,
                },
            },
        });
    }
    catch (err) {
        passErrorToNext_1.default(err, next);
    }
});
