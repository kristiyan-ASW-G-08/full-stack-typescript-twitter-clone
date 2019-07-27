import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/User';
import MailOptions from '@customTypes/MailOptions';
import sendEmail from '@utilities/sendEmail';
import { CustomError, errors } from '@utilities/CustomError';
import ValidationError from '@twtr/common/types/ValidationError';

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

export const checkCredentialsAvailability = async (
  username: string,
  handle: string,
  email: string,
): Promise<void> => {
  const validationErrorsArr: ValidationError[] = [];
  const isAvailableUsername = await User.findOne({ username });
  const isAvailableHandle = await User.findOne({ handle });
  const isAvailableEmail = await User.findOne({ email });
  if (isAvailableUsername) {
    const usernameValidationError = {
      name: 'username',
      message: 'username is already taken',
    };
    validationErrorsArr.push(usernameValidationError);
  }
  if (isAvailableHandle) {
    const handleValidationError = {
      name: 'handle',
      message: 'handle is already taken',
    };
    validationErrorsArr.push(handleValidationError);
  }
  if (isAvailableEmail) {
    const emailValidationError = {
      name: 'email',
      message: 'email is already taken',
    };
    validationErrorsArr.push(emailValidationError);
  }
  if (isAvailableUsername || isAvailableHandle || isAvailableEmail) {
    const { message, status } = errors.Conflict;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
};
