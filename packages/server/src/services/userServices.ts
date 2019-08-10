import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml2html from 'mjml';
import User from '@models/User';
import MailOptions from '@customTypes/MailOptions';
import UserType from '@customTypes/User';
import sendEmail from '@utilities/sendEmail';
import { CustomError, errors } from '@utilities/CustomError';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const createUser = async (
  username: string,
  handle: string,
  email: string,
  password: string,
): Promise<{ userId: string }> => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    handle,
    email,
    password: hashedPassword,
  });
  await user.save();
  const userId = user._id;
  return { userId };
};

export const getUserByEmail = async (
  email: string,
): Promise<{ user: UserType }> => {
  const user = await User.findOne({ email });
  if (!user) {
    const validationErrorsArr: ValidationError[] = [
      {
        name: 'email',
        message: 'User with this email does not exist',
      },
    ];
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
  return { user };
};
export const getUserById = async (
  userId: string,
): Promise<{ user: UserType }> => {
  const user = await User.findById(userId);
  if (!user) {
    const validationErrorsArr: ValidationError[] = [
      {
        name: '',
        message: 'User does not exist',
      },
    ];
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
  return { user };
};
export const checkUserConfirmation = async (user: UserType): Promise<void> => {
  if (!user.confirmed) {
    const validationErrorsArr: ValidationError[] = [
      {
        name: 'email',
        message: 'Confirm your email to login.',
      },
    ];
    const { status, message } = errors.Unauthorized;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
};

export const comparePasswords = async (
  password: string,
  userPassword: string,
): Promise<void> => {
  const passwordMatch = await bcrypt.compare(password, userPassword);
  if (!passwordMatch) {
    const validationErrorsArr: ValidationError[] = [
      {
        name: 'password',
        message: 'Wrong password. Try again',
      },
    ];
    const { status, message } = errors.Unauthorized;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
};
export default comparePasswords;

export const sendConfirmationEmail = (userId: string, email: string): void => {
  const secret = process.env.SECRET;
  const appEmail = process.env.EMAIL;
  const clientUri = process.env.CLIENT_URI;
  const { status, message } = errors.InternalServerError;
  if (!secret) {
    const error = new CustomError(status, message);
    throw error;
  }
  if (!appEmail) {
    const error = new CustomError(status, message);
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
  const validationLevel: 'strict' | 'soft' | 'skip' | undefined = 'strict';
  const options = {
    validationLevel,
  };
  const htmlOutput = mjml2html(
    `
    <mjml>
    <mj-head>
      <mj-attributes>
        <mj-class name="dark" color="#4f4f4f" />
        <mj-class name="primary" color="#1dcaff" />
        <mj-class name="primary-bg" background-color="#1dcaff" />
        <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
        <mj-all font-family="Roboto" />
      </mj-attributes>
    </mj-head>
    <mj-body>
      <mj-hero mode="fixed-height" height="370px" padding="10px 40px 10px 40px">
        <mj-text align="center" font-size="25px" font-weight="900" mj-class="primary">
          TwittClone
        </mj-text>
        <mj-text align="left" font-size="20px" font-weight="900" mj-class="dark">
          Confirm your email address
        </mj-text>
        <mj-text align="left" mj-class="dark" font-size="15px" line-height="20px">
          There is one more step you need to complete before creating your TwittClone account. If you have not registered you can ignore and delete this email.
        </mj-text>
        <mj-button mj-class="primary-bg" href="${url}" align="center">
          Verify email address
        </mj-button>
      </mj-hero>
    </mj-body>
  </mjml>
`,
    options,
  );
  const mailOptions: MailOptions = {
    from: appEmail,
    to: email,
    subject: 'TwittClone Email Confirmation',
    html: htmlOutput.html,
  };
  sendEmail(mailOptions);
};

export const sendPasswordResetEmail = (userId: string, email: string): void => {
  const secret = process.env.SECRET;
  const appEmail = process.env.EMAIL;
  const clientUri = process.env.CLIENT_URI;
  const { status, message } = errors.InternalServerError;
  if (!secret) {
    const error = new CustomError(status, message);
    throw error;
  }
  if (!appEmail) {
    const error = new CustomError(status, message);
    throw error;
  }
  const token = jwt.sign(
    {
      userId,
    },
    secret,
    { expiresIn: '1h' },
  );
  const url = `${clientUri}/reset/${token}`;
  const validationLevel: 'strict' | 'soft' | 'skip' | undefined = 'strict';
  const options = {
    validationLevel,
  };
  const htmlOutput = mjml2html(
    `
    <mjml>
    <mj-head>
      <mj-attributes>
        <mj-class name="dark" color="#4f4f4f" />
        <mj-class name="primary" color="#1dcaff" />
        <mj-class name="primary-bg" background-color="#1dcaff" />
        <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
        <mj-all font-family="Roboto" />
      </mj-attributes>
    </mj-head>
    <mj-body>
      <mj-hero mode="fixed-height" height="370px" padding="10px 40px 10px 40px">
        <mj-text align="center" font-size="25px" font-weight="900" mj-class="primary">
          TwittClone
        </mj-text>
        <mj-text align="left" mj-class="dark" font-size="15px" line-height="20px">
          If you haven't requested password reset, you can ignore this email.
        </mj-text>
        <mj-button mj-class="primary-bg" href="${url}" align="center">
        Reset Your Password
        </mj-button>
      </mj-hero>
    </mj-body>
  </mjml>
`,
    options,
  );
  const mailOptions: MailOptions = {
    from: appEmail,
    to: email,
    subject: 'TwittClone Password Reset',
    html: htmlOutput.html,
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
