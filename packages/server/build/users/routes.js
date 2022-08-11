"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controller_1 = require("src/users/controller");
const validationHandler_1 = __importDefault(require("..//middleware/validationHandler"));
const authenticationHandler_1 = __importDefault(require("..//middleware/authenticationHandler"));
const validators_1 = __importDefault(require("@twtr/common/source/schemaValidators/validators"));
const paginationHandler_1 = __importDefault(require("..//middleware/paginationHandler"));
const fileFilter_1 = __importDefault(require("../middleware/fileFilter"));
const fileStorage_1 = __importDefault(require("../middleware/fileStorage"));
const router = express_1.default.Router();
router.post('/users', (0, validationHandler_1.default)([
    { schema: validators_1.default.UserSignUpValidator, target: 'body' },
]), controller_1.signUp);
router.post('/users/user/tokens', (0, validationHandler_1.default)([
    { schema: validators_1.default.UserLoginValidator, target: 'body' },
]), controller_1.logIn);
router.post('/users/user', (0, validationHandler_1.default)([{ schema: validators_1.default.EmailValidator, target: 'body' }]), controller_1.requestPasswordResetEmail);
router.patch('/users/user/:token/confirm', controller_1.verifyEmail);
router.patch('/users/user/reset', authenticationHandler_1.default, (0, validationHandler_1.default)([
    { schema: validators_1.default.ResetPasswordValidator, target: 'body' },
]), controller_1.resetPassword);
router.patch('/users/user/profile', authenticationHandler_1.default, (0, multer_1.default)({ storage: fileStorage_1.default, fileFilter: fileFilter_1.default }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
]), (0, validationHandler_1.default)([
    { schema: validators_1.default.UserProfileValidator, target: 'body' },
]), controller_1.patchProfile);
router.patch('/users/tweets/:tweetId/bookmark', authenticationHandler_1.default, controller_1.bookmarkTweet);
router.patch('/users/tweets/:tweetId/like', authenticationHandler_1.default, controller_1.likeTweet);
router.patch('/users/:userId', authenticationHandler_1.default, controller_1.followUser);
router.delete('/users', authenticationHandler_1.default, controller_1.deleteUser);
router.get('/users/user/bookmarks', authenticationHandler_1.default, (0, validationHandler_1.default)([
    { schema: validators_1.default.SortStringValidator, target: 'query' },
]), paginationHandler_1.default, controller_1.getUserBookmarks);
router.get('/users/:userId/likes', (0, validationHandler_1.default)([
    { schema: validators_1.default.SortStringValidator, target: 'query' },
]), paginationHandler_1.default, controller_1.getUserLikes);
router.get('/users/:handle', (0, validationHandler_1.default)([
    { schema: validators_1.default.UserHandleValidator, target: 'params' },
]), controller_1.getUsersList);
router.get('/users/user/tweets', authenticationHandler_1.default, (0, validationHandler_1.default)([
    { schema: validators_1.default.SortStringValidator, target: 'query' },
]), paginationHandler_1.default, controller_1.getUserFeed);
router.get('/users/user/:userId', controller_1.getUser);
router.get('/users/:userId/following', (0, validationHandler_1.default)([
    { schema: validators_1.default.SortStringValidator, target: 'query' },
]), paginationHandler_1.default, controller_1.getUserFollowing);
router.get('/users/:userId/followers', (0, validationHandler_1.default)([
    { schema: validators_1.default.SortStringValidator, target: 'query' },
]), paginationHandler_1.default, controller_1.getUserFollowers);
exports.default = router;
