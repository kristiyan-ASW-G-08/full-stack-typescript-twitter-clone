import { Request, Response, NextFunction } from 'express';
import {
  createUser,
  sendConfirmationEmail,
  checkCredentialsAvailability,
} from '@services/userServices';
import passErrorToNext from '@utilities//passErrorToNext';

const signUp = async (
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

export default signUp;
