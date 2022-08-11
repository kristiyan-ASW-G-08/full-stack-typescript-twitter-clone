"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const RESTError_1 = require("./RESTError");
const sendEmail = (mailOptions) => {
    try {
        const { EMAIL, EMAIL_PASSWORD } = process.env;
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: EMAIL_PASSWORD,
            },
        });
        transporter.sendMail(mailOptions);
    }
    catch (err) {
        const { status, message } = RESTError_1.errors.UnprocessableEntity;
        throw new RESTError_1.RESTError(status, message);
    }
};
exports.default = sendEmail;
