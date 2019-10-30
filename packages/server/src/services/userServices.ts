import mongoose from 'mongoose';
import User from '@models/User';
import UserType from '@customTypes/User';
import { CustomError, errors } from '@utilities/CustomError';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const getUserByEmail = async (email: string): Promise<UserType> => {
  const user = await User.findOne({ email });
  if (!user) {
    const validationErrorsArr: ValidationError[] = [
      {
        path: 'email',
        message: 'User not found!',
      },
    ];
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
  return user;
};
export const getUserById = async (
  userId: string,
  secure: boolean = true,
): Promise<UserType> => {
  const user = secure
    ? await User.findById(userId)
    : await User.findById(userId).select('-password -email -confirmed');
  if (!user) {
    const validationErrorsArr: ValidationError[] = [
      {
        path: '',
        message: 'User not found!',
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
        path: 'email',
        message: 'Confirm your email to proceed.',
      },
    ];
    const { status, message } = errors.Unauthorized;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
};

export const areCredentialsAvailable = async (
  credentials: { path: 'username' | 'handle' | 'email'; value: string }[],
  userId?: string,
): Promise<void> => {
  let validationErrorsArr: ValidationError[] = [];
  const userObjectId = mongoose.Types.ObjectId(userId);
  for await (const credential of credentials) {
    const { path } = credential;
    const query: { [key: string]: string } = {};
    query[credential.path] = credential.value;
    const user = await User.findOne(query);
    if (user && !userObjectId.equals(user._id)) {
      validationErrorsArr = [
        ...validationErrorsArr,
        {
          path,
          message: `${path} is already taken`,
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
