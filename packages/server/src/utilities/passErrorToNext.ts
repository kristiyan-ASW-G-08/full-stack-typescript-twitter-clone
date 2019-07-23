import { NextFunction } from 'express';
import { CustomError, errors } from '@utilities/CustomError';

const passErrorToNext = (err: any, next: NextFunction): void => {
  let error = err;
  if (!err.status) {
    const { status, message } = errors.InternalServerError;
    error = new CustomError(status, message, err);
  }
  next(error);
};
export default passErrorToNext;
