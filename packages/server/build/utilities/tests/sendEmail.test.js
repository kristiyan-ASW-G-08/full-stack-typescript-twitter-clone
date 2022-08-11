"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail_1 = __importDefault(require("utilities/sendEmail"));
const sendMailMock = jest.fn();
jest.mock('nodemailer');
nodemailer_1.default.createTransport.mockReturnValue({
    sendMail: sendMailMock,
});
describe('sendEmail', () => {
    const appEmail = 'someEmailmail.com';
    const clientUri = 'https://client.com';
    const token = 'mockToken';
    const url = `${clientUri}/confirmation/${token}`;
    const email = 'testMailmail.com';
    const mailOptions = {
        from: appEmail,
        to: email,
        subject: 'TwittClone Email Confirmation',
        html: `Confirm your email: <a href="${url}">${url}</a>`,
    };
    it('should call createTransport and sendMail', () => {
        expect.assertions(2);
        (0, sendEmail_1.default)(mailOptions);
        expect(nodemailer_1.default.createTransport).toHaveBeenCalledTimes(1);
        expect(sendMailMock).toHaveBeenCalledTimes(1);
    });
});
