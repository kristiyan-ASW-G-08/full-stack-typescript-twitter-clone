import isAuthorized from '@utilities/isAuthorized';
import { CustomError, errors } from '@utilities/CustomError';
import mongoose from 'mongoose';

describe('isAuthorized', (): void => {
  const authorizedUserId = mongoose.Types.ObjectId().toString();
  const userId = mongoose.Types.ObjectId().toString();
  it(`should throw an error`, async (): Promise<void> => {
    const { status, message } = errors.Unauthorized;
    const error = new CustomError(status, message);
    expect((): void => isAuthorized(authorizedUserId, userId)).toThrow(error);
  });
  it(`shouldn't throw an error`, async (): Promise<void> => {
    await expect((): void =>
      isAuthorized(authorizedUserId, authorizedUserId),
    ).not.toThrow();
  });
});
