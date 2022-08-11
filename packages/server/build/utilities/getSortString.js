"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getSortString = (sort) => {
    const sortStrings = {
        top: '-likes',
        trending: '-retweets',
        new: '-date',
        replies: '-replies',
    };
    return sortStrings[sort] || '-date';
};
exports.default = getSortString;
