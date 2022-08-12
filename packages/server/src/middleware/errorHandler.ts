import { Response, Request, NextFunction } from 'express';
import RESTError from '../utilities/RESTError';
import logger from '../utilities/logger';

const errorHandler = (
  error: RESTError,
  _req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const status = error.status || 500;
  const { message, data } = error;
  res.status(status).json({ data: JSON.stringify(error), message ,status});
};
export default errorHandler;
