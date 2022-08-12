import { NextFunction } from 'express';
import winston from 'winston';
import logger from './logger';
import RESTError, { errors } from './RESTError';

const passErrorToNext = (err: any | RESTError, next: NextFunction): void => {
  logger.info(JSON.stringify(err));
  if (err.status !== undefined) {
    next(err);
  } else {
    const { status, message } = errors.InternalServerError;
    next(new RESTError(status, message, err));
  }
};
export default passErrorToNext;
