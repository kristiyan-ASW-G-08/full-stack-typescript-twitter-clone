import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import {
  createUser,
  getUserByEmail,
  getUserById,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  checkCredentialsAvailability,
  comparePasswords,
  checkUserConfirmation,
} from '@services/userServices';
import passErrorToNext from '@utilities/passErrorToNext';
import { CustomError, errors } from '@utilities/CustomError';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, handle, email, password } = req.body;
    await checkCredentialsAvailability(username, handle, email);
    const userId = await createUser(username, handle, email, password);
    sendConfirmationEmail(userId, email);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const logIn = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const secret = process.env.SECRET;
    const user = await getUserByEmail(email);
    await comparePasswords(password, user.password);
    await checkUserConfirmation(user);
    const token = jwt.sign(
      {
        userId: user._id,
      },
      secret,
      { expiresIn: '1h' },
    );
    const { username, handle, following, likes, bookmarks, date } = user;
    const userData = {
      username,
      handle,
      following,
      likes,
      bookmarks,
      email,
      date,
    };
    res.status(200).json({ data: { token, user: userData } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const confirmEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { token } = req.params;
    const secret = process.env.SECRET;
    const { userId }: any = jwt.verify(
      token,
      secret,
      (err: any, decoded: any): { userId: string } => {
        if (err) {
          const { status, message } = errors.Unauthorized;
          const error = new CustomError(status, message);
          throw error;
        } else {
          return decoded;
        }
      },
    );
    const user = await getUserById(userId);
    user.confirmed = true;
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const requestPasswordResetEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = req.params;
    const user = await getUserByEmail(email);
    sendPasswordResetEmail(user._id, email);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
