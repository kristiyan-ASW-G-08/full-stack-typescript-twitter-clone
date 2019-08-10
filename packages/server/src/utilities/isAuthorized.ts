import { CustomError, errors } from '@utilities/CustomError';

const isAuthorized = (authorizedUserId: string, userId: string): void => {
  if (authorizedUserId !== userId) {
    const { status, message } = errors.Unauthorized;
    const error = new CustomError(status, message);
    throw error;
  }
};
export default isAuthorized;
