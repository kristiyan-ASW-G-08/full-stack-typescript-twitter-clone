import { NextFunction } from 'express';
import { ErrorService, errors } from '@utilities/ErrorService';

const passErrorToNext = (err: any, next: NextFunction): void => {
  let error = err;
  if (!err.status) {
    const { status, message } = errors.InternalServerError;
    error = new ErrorService(status, message, err);
  }
  next(error);
};
export default passErrorToNext;
