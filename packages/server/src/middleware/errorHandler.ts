import { Response, Request, NextFunction } from 'express';
import RESTError from '@utilities/RESTError';
import logger from '@utilities/logger';

const errorHandler = (error: RESTError, _req: Request, res: Response): void => {
  const status = error.status || 500;
  const { message, data } = error;
  const resData = data ? { data, message } : { message };
  res.status(status).json(resData);
};
export default errorHandler;
