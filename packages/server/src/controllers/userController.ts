import { Request, Response, NextFunction } from 'express';
import passErrorToNext from '@utilities//passErrorToNext';

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, username, password, confirmPassword } = req.body;
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export default signUp;
