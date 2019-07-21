import { Request, Response, NextFunction } from 'express';

const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, username, password } = req.body;
  } catch (err) {
    console.log(err);
  }
};

export default signUp;
