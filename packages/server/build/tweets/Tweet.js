"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweetSchema = void 0;
const mongoose_1 = __importStar(require("mongoose"));
exports.TweetSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
        enum: ['text', 'link', 'retweet', 'reply'],
    },
    text: { type: String, maxlength: 500 },
    image: { type: String },
    link: { type: String },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    retweet: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Tweet',
    },
    reply: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Tweet' },
    retweets: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    replies: { type: Number, default: 0 },
    date: {
        type: Date,
        default: Date.now,
    },
});
//@ts-ignore
function populateFields() {
    return __awaiter(this, void 0, void 0, function* () {
        this.populate([
            { path: 'user', select: 'username handle avatar' },
            { path: 'reply', select: 'user' },
            { path: 'retweet' },
        ]);
    });
}
exports.TweetSchema.pre('find', populateFields);
exports.TweetSchema.pre('populate', populateFields);
exports.default = mongoose_1.default.model('Tweet', exports.TweetSchema);
