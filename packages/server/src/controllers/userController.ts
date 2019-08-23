import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import {
  createUser,
  getUserByEmail,
  getUserById,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  areCredentialsAvailable,
  comparePasswords,
  checkUserConfirmation,
} from '@services/userServices';
import { getTweetById } from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';
import includesObjectId from '@utilities/includesObjectId';
import removeObjectIdFromArr from '@utilities/removeObjectIdFromArr';
import SourceRef from '@customTypes/SourceRef';
import User from '@models/User';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, handle, email, password } = req.body;
    const credentials: {
      name: 'username' | 'handle' | 'email';
      value: string;
    }[] = [
      { name: 'username', value: username },
      { name: 'handle', value: handle },
      { name: 'email', value: email },
    ];
    await areCredentialsAvailable(credentials);
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
    const bookmarkIds = user.bookmarks.map(
      (bookmark: SourceRef): mongoose.Types.ObjectId => bookmark.source,
    );
    if (!includesObjectId(bookmarkIds, tweetId)) {
      user.bookmarks = [
        ...user.bookmarks,
        { source: mongoose.Types.ObjectId(tweetId), ref: 'Tweet' },
      ];
    } else {
      user.bookmarks = user.bookmarks.filter(
        (bookmark: SourceRef): boolean =>
          !bookmark.source.equals(mongoose.Types.ObjectId(tweetId)),
      );
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
    const likeIds = user.likes.map(
      (like: SourceRef): mongoose.Types.ObjectId => like.source,
    );
    if (!includesObjectId(likeIds, tweetId)) {
      user.likes = [
        ...user.likes,
        { source: mongoose.Types.ObjectId(tweetId), ref: 'Tweet' },
      ];
      tweet.likes += 1;
    } else {
      user.likes = user.likes.filter(
        (like: SourceRef): boolean =>
          !like.source.equals(mongoose.Types.ObjectId(tweetId)),
      );
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

export const getUserBookmarks = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const user = await getUserById(userId);
    const populatedUser = await user
      .populate('bookmarks.source')
      .execPopulate();
    const { bookmarks } = populatedUser;
    res.status(200).json({ data: { bookmarks } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, handle, website } = req.body;
    const { userId } = req;
    const credentials: {
      name: 'username' | 'handle' | 'email';
      value: string;
    }[] = [
      { name: 'username', value: username },
      { name: 'handle', value: handle },
    ];

    await areCredentialsAvailable(credentials, userId);
    const user = await getUserById(userId);
    user.username = username;
    user.handle = handle;
    user.website = website;
    console.log(req.files, 'Files!!!!!!!!!!!!!!!!!!!!!!!');
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUsersList = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { searchTerm } = req.params;
    const users = await User.find(
      {
        $text: { $search: searchTerm },
      },
      'username handle profilePhoto',
    )
      .select({ score: { $meta: 'textScore' } })
      .exec();
    res.status(200).json({ data: { users } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
