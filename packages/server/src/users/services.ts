import mongoose from 'mongoose';
import User from 'src/users/User';
import UserType from '@customTypes/User';
import { RESTError, errors } from '@utilities/RESTError';
import ValidationError from '@twtr/common/source/types/ValidationError';
import getResource from '@utilities/getResource';

export const getUserByEmail = async (email: string): Promise<UserType> =>
  getResource<UserType>(User, { name: 'email', value: email });

export const getUserById = async (
  userId: string,
  secure: boolean = true,
): Promise<UserType> =>
  getResource<UserType>(
    User,
    { name: '_id', value: userId },
    secure ? '' : '-password -email -confirmed',
  );

interface Credential {
  path: 'username' | 'handle' | 'email';
  value: string;
}
export const areCredentialsAvailable = async (
  credentials: Credential[],
  userId?: string,
): Promise<void> => {
  const userObjectId = mongoose.Types.ObjectId(userId);
  const validationErrors: ValidationError[] = await credentials.reduce(
    async (
      acc: Promise<ValidationError[]>,
      { path, value }: Credential,
    ): Promise<ValidationError[]> => {
      const resolvedAcc = await acc;
      const query = {
        [path]: value,
      };
      const user = await User.findOne(query);
      if (user && !userObjectId.equals(user._id)) {
        const validationError = {
          path,
          message: `${value} is already taken`,
        };
        return [validationError, ...resolvedAcc];
      }
      return [...resolvedAcc];
    },
    Promise.resolve([]),
  );

  if (validationErrors.length !== 0) {
    const { message, status } = errors.Conflict;
    const error = new RESTError(status, message, validationErrors);
    throw error;
  }
};
