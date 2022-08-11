"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateLink = (urlExtension, queries) => {
    const { PORT } = process.env;
    if (queries) {
        const stringifiedQueries = Object.entries(queries)
            .map(([query, value]) => `${query}=${value}`)
            .join('&');
        return `${PORT}/${urlExtension}?${stringifiedQueries}`;
    }
    return `${PORT}/${urlExtension}`;
};
exports.default = generateLink;
