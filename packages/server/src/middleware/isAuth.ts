import { verify } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomError, errors } from '@utilities/CustomError';

const isAuth = (req: Request, res: Response, next: NextFunction): void => {
  const secret = process.env.SECRET;
  const authHeader = req.get('Authorization');
  const { status, message } = errors.Unauthorized;
  const error = new CustomError(status, message);
  if (!authHeader) {
    throw error;
  }
  const token = authHeader.split(' ')[1];
  const decodedToken = verify(token, secret);
  // @ts-ignore
  const { userId } = decodedToken;
  if (!decodedToken || !userId) {
    throw error;
  }
  req.userId = userId;
  next();
};
export default isAuth;