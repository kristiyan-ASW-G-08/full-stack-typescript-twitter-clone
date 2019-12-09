import nodemailer from 'nodemailer';
import MailOptions from '@customTypes/MailOptions';
import { RESTError, errors } from '@utilities/RESTError';

const sendEmail = (mailOptions: MailOptions): void => {
  try {
    const { EMAIL, EMAIL_PASSWORD } = process.env;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });
    transporter.sendMail(mailOptions);
  } catch (err) {
    const { status, message } = errors.UnprocessableEntity;
    throw new RESTError(status, message);
  }
};
export default sendEmail;
