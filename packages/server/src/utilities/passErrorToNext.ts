import { NextFunction } from 'express';
import { RESTError, errors } from '@utilities/RESTError';

const passErrorToNext = (err: any, next: NextFunction): void => {
  let error = err;
  if (!err.status) {
    const { status, message } = errors.InternalServerError;
    error = new RESTError(status, message, err);
  }
  next(error);
};
export default passErrorToNext;
