import { RESTError, errors } from '@utilities/RESTError';

const isAuthorized = (authorizedUserId: string, userId: string): void => {
  if (authorizedUserId !== userId) {
    const { status, message } = errors.Unauthorized;
    const error = new RESTError(status, message);
    throw error;
  }
};
export default isAuthorized;
