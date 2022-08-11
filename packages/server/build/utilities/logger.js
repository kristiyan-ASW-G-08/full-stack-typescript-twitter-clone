"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const { combine, timestamp, colorize, prettyPrint } = winston_1.format;
const { File, Console } = winston_1.transports;
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(timestamp(), prettyPrint(), colorize()),
    transports: [
        new File({
            filename: 'error.log',
            level: 'error',
        }),
        new File({ filename: 'combined.log' }),
    ],
});
if (process.env.NODE_ENV !== 'production') {
    logger.add(new Console({
        format: winston_1.format.simple(),
    }));
}
exports.default = logger;
