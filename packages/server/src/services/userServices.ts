import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/User';
import MailOptions from '@customTypes/MailOptions';
import sendEmail from '@utilities/sendEmail';
import { CustomError, errors } from '@utilities/CustomError';

export const createUser = async (
  username: string,
  handle: string,
  email: string,
  password: string,
): Promise<string> => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    handle,
    email,
    password: hashedPassword,
  });
  await user.save();
  return user._id;
};
export const sendConfirmationEmail = (userId: string, email: string): void => {
  const secret = process.env.SECRET;
  const appEmail = process.env.EMAIL;
  const clientUri = process.env.CLIENT_URI;
  const { status, message } = errors.BadRequest;
  if (!secret) {
    const error = new CustomError(status, message, 'Provide env secret');
    throw error;
  }
  if (!appEmail) {
    const error = new CustomError(status, message, 'Provide env email');
    throw error;
  }
  const token = jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  const url = `${clientUri}/confirmation/${token}`;
  const mailOptions: MailOptions = {
    from: appEmail,
    to: email,
    subject: 'TwittClone Email Confirmation',
    html: `Confirm your email: <a href="${url}">${url}</a>`,
  };
  sendEmail(mailOptions);
};
