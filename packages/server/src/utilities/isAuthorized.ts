import { RESTError, errors } from './RESTError';

const isAuthorized = (authorizedUserId: string, userId: string): void => {
  if (authorizedUserId !== userId) {
    const { status, message } = errors.Unauthorized;
    throw new RESTError(status, message);
  }
};
export default isAuthorized;
