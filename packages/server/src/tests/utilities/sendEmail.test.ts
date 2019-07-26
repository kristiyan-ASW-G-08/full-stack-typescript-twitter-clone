import nodemailer from 'nodemailer';

import sendEmail from '@utilities/sendEmail';
import MailOptions from '@customTypes/MailOptions';

const sendMailMock = jest.fn();
jest.mock('nodemailer');
(nodemailer.createTransport as jest.Mock).mockReturnValue({
  sendMail: sendMailMock,
});

describe('sendEmail', (): void => {
  const appEmail = process.env.EMAIL;
  const clientUri = process.env.CLIENT_URI;
  const token = 'mockToken';
  const url = `${clientUri}/confirmation/${token}`;
  const email = 'testMail@mail.com';
  const mailOptions: MailOptions = {
    from: appEmail,
    to: email,
    subject: 'TwittClone Email Confirmation',
    html: `Confirm your email: <a href="${url}">${url}</a>`,
  };
  it('should call createTransport and sendMail', (): void => {
    expect.assertions(2);
    sendEmail(mailOptions);
    expect(nodemailer.createTransport).toHaveBeenCalledTimes(1);
    expect(sendMailMock).toHaveBeenCalledTimes(1);
  });
});
