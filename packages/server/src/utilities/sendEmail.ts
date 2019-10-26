import nodemailer from 'nodemailer';
import MailOptions from '@customTypes/MailOptions';
import { CustomError, errors } from '@utilities/CustomError';

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
    const error = new CustomError(status, message);
    throw error;
  }
};
export default sendEmail;
