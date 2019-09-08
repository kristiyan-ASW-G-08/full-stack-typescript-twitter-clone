import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '@models/User';
import UserType from '@customTypes/User';
import { CustomError, errors } from '@utilities/CustomError';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const getUserByEmail = async (email: string): Promise<UserType> => {
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
  return user;
};
export const getUserById = async (userId: string): Promise<UserType> => {
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
  return user;
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

export const areCredentialsAvailable = async (
  credentials: { name: 'username' | 'handle' | 'email'; value: string }[],
  userId?: string,
): Promise<void> => {
  let validationErrorsArr: ValidationError[] = [];
  const userObjectId = mongoose.Types.ObjectId(userId);
  for await (const credential of credentials) {
    const { name } = credential;
    const query: { [key: string]: string } = {};
    query[`${credential.name}`] = credential.value;
    const user = await User.findOne(query);
    if (user && !userObjectId.equals(user._id)) {
      validationErrorsArr = [
        ...validationErrorsArr,
        {
          name,
          message: `${name} is already taken`,
        },
      ];
    }
  }
  if (validationErrorsArr.length !== 0) {
    const { message, status } = errors.Conflict;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
};
