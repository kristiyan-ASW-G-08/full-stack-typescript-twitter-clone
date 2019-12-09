import { Response, Request, NextFunction } from 'express';
import RESTError from '@utilities/RESTError';
import logger from '@utilities/logger';

const errorHandler = (
  error: RESTError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.log(error);
  logger.error(error);
  const status = error.status || 500;
  const { message, data } = error;
  const resData = data ? { data, message } : { message };
  res.status(status).json(resData);
};
export default errorHandler;
