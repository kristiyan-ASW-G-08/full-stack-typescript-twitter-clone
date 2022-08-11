"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const controller_1 = require("./controller");
const TweetValidator_1 = __importDefault(require("@twtr/common/source/schemaValidators/TweetValidator"));
const SortStringValidator_1 = __importDefault(require("@twtr/common/source/schemaValidators/SortStringValidator"));
const validationHandler_1 = __importDefault(require("../middleware/validationHandler"));
const authenticationHandler_1 = __importDefault(require("../middleware/authenticationHandler"));
const paginationHandler_1 = __importDefault(require("../middleware/paginationHandler"));
const fileFilter_1 = __importDefault(require("../middleware/fileFilter"));
const fileStorage_1 = __importDefault(require("../middleware/fileStorage"));
const multerStorage = (0, multer_1.default)({ storage: fileStorage_1.default, fileFilter: fileFilter_1.default }).single('image');
const router = express_1.default.Router();
router.post('/tweets', authenticationHandler_1.default, multerStorage, (0, validationHandler_1.default)([{ schema: TweetValidator_1.default, target: 'body' }]), controller_1.postTweet);
router.patch('/tweets/:tweetId', authenticationHandler_1.default, multerStorage, (0, validationHandler_1.default)([{ schema: TweetValidator_1.default, target: 'body' }]), controller_1.patchTweet);
router.delete('/tweets/:tweetId', authenticationHandler_1.default, controller_1.deleteTweet);
router.get('/tweets/:tweetId', controller_1.getTweet);
router.get('/tweets', (0, validationHandler_1.default)([{ schema: SortStringValidator_1.default, target: 'query' }]), paginationHandler_1.default, controller_1.getAllTweets);
router.get('/users/:userId/tweets', (0, validationHandler_1.default)([{ schema: SortStringValidator_1.default, target: 'query' }]), paginationHandler_1.default, controller_1.getUserTweets);
router.get('/tweets/:tweetId/replies', (0, validationHandler_1.default)([{ schema: SortStringValidator_1.default, target: 'query' }]), paginationHandler_1.default, controller_1.getReplies);
router.get('/users/:userId/replies', (0, validationHandler_1.default)([{ schema: SortStringValidator_1.default, target: 'query' }]), paginationHandler_1.default, controller_1.getUserReplies);
exports.default = router;
