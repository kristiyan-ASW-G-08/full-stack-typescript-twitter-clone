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
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable import/no-duplicates */
const yup = __importStar(require("yup"));
const TweetValidator = yup.object().shape({
    type: yup
        .string()
        .trim()
        .oneOf(['text', 'link', 'retweet', 'reply'])
        .required(),
    replyId: yup
        .string()
        .trim()
        .when('type', (type, schema) => {
        return type === 'reply' ? schema.required() : schema.notRequired();
    }),
    text: yup
        .string()
        .trim()
        .max(500),
    retweetId: yup
        .string()
        .trim()
        .when('type', (type, schema) => {
        return type === 'retweet' ? schema.required() : schema.notRequired();
    }),
    linkUrl: yup
        .string()
        .trim()
        .url(),
});
exports.default = TweetValidator;
