import { Request, Response, NextFunction } from 'express';
import {
  createUser,
  getUserByEmail,
  sendConfirmationEmail,
  checkCredentialsAvailability,
  getAuthenticationToken,
  comparePasswords,
  checkUserConfirmation,
} from '@services/userServices';
import passErrorToNext from '@utilities//passErrorToNext';

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
    const user = await getUserByEmail(email);
    await comparePasswords(password, user.password);
    await checkUserConfirmation(user);
    const token = await getAuthenticationToken(user._id);
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
