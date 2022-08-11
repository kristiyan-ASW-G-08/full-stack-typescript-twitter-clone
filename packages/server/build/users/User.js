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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
//@ts-ignore
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
const UserSchema = new mongoose_1.Schema({
    username: {
        required: true,
        type: String,
        minlength: 1,
        maxlength: 50,
        unique: true,
    },
    handle: {
        required: true,
        type: String,
        minlength: 1,
        maxlength: 50,
        unique: true,
    },
    email: { required: true, type: String, minlength: 3, unique: true },
    password: { required: true, type: String, minlength: 12 },
    isConfirmed: { type: Boolean, default: true },
    avatar: {
        type: String,
    },
    cover: { type: String },
    date: {
        type: Date,
        default: Date.now,
    },
    following: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    followers: {
        type: Number,
        default: 0,
    },
    likes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tweet',
        },
    ],
    retweets: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tweet',
        },
    ],
    replies: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tweet',
        },
    ],
    bookmarks: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Tweet',
        },
    ],
});
UserSchema.index({ handle: 'text' });
UserSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('User', UserSchema);
