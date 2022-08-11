"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileFilter = (_, file, cb) => {
    const formats = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/svg+xml',
        'image/webp',
    ];
    cb(null, formats.includes(file.mimetype));
};
exports.default = fileFilter;
