import nodemailer from 'nodemailer';
import MailOptions from '@customTypes/MailOptions';
import { CustomError, errors } from '@utilities/CustomError';

const sendEmail = (mailOptions: MailOptions): void => {
  try {
    const email = process.env.EMAIL;
    const emailPassword = process.env.EMAIL_PASSWORD;
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: email,
        pass: emailPassword,
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
