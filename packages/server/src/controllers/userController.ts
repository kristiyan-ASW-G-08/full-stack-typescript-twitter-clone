import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
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
import { getTweetById, getTweetsByUserId } from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';
import includesObjectId from '@utilities/includesObjectId';
import removeObjectIdFromArr from '@utilities/removeObjectIdFromArr';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, handle, email, password } = req.body;
    await checkCredentialsAvailability(username, handle, email);
    const { userId } = await createUser(username, handle, email, password);
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
    const { userId } = req;
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
    await checkUserConfirmation(user);
    sendPasswordResetEmail(user._id, email);
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password } = req.body;
    const { userId } = req;
    const user = await getUserById(userId);
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const user = await getUserById(userId);
    await user.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const bookmarkTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const { userId } = req;
    const user = await getUserById(userId);
    if (!includesObjectId(user.bookmarks, tweetId)) {
      user.bookmarks = [...user.bookmarks, tweetId];
    } else {
      user.bookmarks = removeObjectIdFromArr(user.bookmarks, tweetId);
    }
    await user.save();
    const { bookmarks } = user;
    res.status(200).json({ data: { bookmarks } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const likeTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const { userId } = req;
    const user = await getUserById(userId);
    const { tweet } = await getTweetById(tweetId);
    if (!includesObjectId(user.likes, tweetId)) {
      user.likes = [...user.likes, tweetId];
      tweet.likes += 1;
    } else {
      user.likes = removeObjectIdFromArr(user.likes, tweetId);
      tweet.likes -= 1;
    }
    await tweet.save();
    await user.save();
    const { likes } = user;
    res.status(200).json({ data: { likes } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const followUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const authenticatedUserId = req.userId;
    const user = await getUserById(userId);
    const authenticatedUser = await getUserById(authenticatedUserId);
    if (!includesObjectId(authenticatedUser.following, userId)) {
      authenticatedUser.following = [...authenticatedUser.following, userId];
      user.followers += 1;
    } else {
      authenticatedUser.following = removeObjectIdFromArr(
        authenticatedUser.following,
        userId,
      );
      user.followers -= 1;
    }
    await user.save();
    await authenticatedUser.save();
    const { following } = authenticatedUser;
    res.status(200).json({ data: { following } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserTweets = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10) || 1;
    const { SERVER_URL } = process.env;
    const { tweets, tweetsCount } = await getTweetsByUserId(
      sort,
      limit,
      page,
      userId,
    );
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (tweetsCount > 0) {
      links.next = `${SERVER_URL}/users/${userId}/tweets?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/${userId}/tweets?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { tweets, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
