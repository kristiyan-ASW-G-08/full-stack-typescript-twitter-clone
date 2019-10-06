import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mjml2html from 'mjml';
import {
  getUserByEmail,
  getUserById,
  areCredentialsAvailable,
  checkUserConfirmation,
} from '@services/userServices';
import { getTweetById } from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';
import includesObjectId from '@utilities/includesObjectId';
import removeObjectIdFromArr from '@utilities/removeObjectIdFromArr';
import getSortString from '@utilities/getSortString';
import MailOptions from '@customTypes/MailOptions';
import User from '@models/User';
import Tweet from '@models/Tweet';
import { CustomError, errors } from '@utilities/CustomError';
import sendEmail from '@utilities/sendEmail';
import ValidationError from '@twtr/common/source/types/ValidationError';

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
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
      username,
      handle,
      email,
      password: hashedPassword,
    });
    await user.save();
    const userId = user._id;
    const secret = process.env.SECRET;
    const appEmail = process.env.EMAIL;
    const clientUri = process.env.CLIENT_URL;
    const { status, message } = errors.InternalServerError;
    if (!secret) {
      const error = new CustomError(status, message);
      throw error;
    }
    if (!appEmail) {
      const error = new CustomError(status, message);
      throw error;
    }
    const token = jwt.sign(
      {
        userId,
      },
      secret,
      { expiresIn: '1h' },
    );
    const url = `${clientUri}/confirmation/${token}`;
    const validationLevel: 'strict' | 'soft' | 'skip' | undefined = 'strict';
    const options = {
      validationLevel,
    };
    const htmlOutput = mjml2html(
      `
      <mjml>
      <mj-head>
        <mj-attributes>
          <mj-class name="dark" color="#4f4f4f" />
          <mj-class name="primary" color="#1dcaff" />
          <mj-class name="primary-bg" background-color="#1dcaff" />
          <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
          <mj-all font-family="Roboto" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-hero mode="fixed-height" height="370px" padding="10px 40px 10px 40px">
          <mj-text align="center" font-size="25px" font-weight="900" mj-class="primary">
            TwittClone
          </mj-text>
          <mj-text align="left" font-size="20px" font-weight="900" mj-class="dark">
            Confirm your email address
          </mj-text>
          <mj-text align="left" mj-class="dark" font-size="15px" line-height="20px">
            There is one more step you need to complete before creating your TwittClone account. If you have not registered you can ignore and delete this email.
          </mj-text>
          <mj-button mj-class="primary-bg" href="${url}" align="center">
            Verify email address
          </mj-button>
        </mj-hero>
      </mj-body>
    </mjml>
  `,
      options,
    );
    const mailOptions: MailOptions = {
      from: appEmail,
      to: email,
      subject: 'TwittClone Email Confirmation',
      html: htmlOutput.html,
    };
    sendEmail(mailOptions);
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
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const validationErrorsArr: ValidationError[] = [
        {
          name: 'password',
          message: 'Wrong password. Try again',
        },
      ];
      const { status, message } = errors.Unauthorized;
      const error = new CustomError(status, message, validationErrorsArr);
      throw error;
    }
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

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const secret = process.env.SECRET;
    const { token } = req.params;
    console.log(token, 'Verify');
    const decodedToken = jwt.verify(token, secret);
    // @ts-ignore
    const { userId } = decodedToken;
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
    const { email } = req.body;
    const user = await getUserByEmail(email);
    await checkUserConfirmation(user);
    const secret = process.env.SECRET;
    const appEmail = process.env.EMAIL;
    const clientUri = process.env.CLIENT_URI;
    const { status, message } = errors.InternalServerError;
    if (!secret) {
      const error = new CustomError(status, message);
      throw error;
    }
    if (!appEmail) {
      const error = new CustomError(status, message);
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      secret,
      { expiresIn: '1h' },
    );
    const url = `${clientUri}/reset/${token}`;
    const validationLevel: 'strict' | 'soft' | 'skip' | undefined = 'strict';
    const options = {
      validationLevel,
    };
    const htmlOutput = mjml2html(
      `
      <mjml>
      <mj-head>
        <mj-attributes>
          <mj-class name="dark" color="#4f4f4f" />
          <mj-class name="primary" color="#1dcaff" />
          <mj-class name="primary-bg" background-color="#1dcaff" />
          <mj-font name="Roboto" href="https://fonts.googleapis.com/css?family=Roboto&display=swap" />
          <mj-all font-family="Roboto" />
        </mj-attributes>
      </mj-head>
      <mj-body>
        <mj-hero mode="fixed-height" height="370px" padding="10px 40px 10px 40px">
          <mj-text align="center" font-size="25px" font-weight="900" mj-class="primary">
            TwittClone
          </mj-text>
          <mj-text align="left" mj-class="dark" font-size="15px" line-height="20px">
            If you haven't requested password reset, you can ignore this email.
          </mj-text>
          <mj-button mj-class="primary-bg" href="${url}" align="center">
          Reset Your Password
          </mj-button>
        </mj-hero>
      </mj-body>
    </mjml>
  `,
      options,
    );
    const mailOptions: MailOptions = {
      from: appEmail,
      to: email,
      subject: 'TwittClone Password Reset',
      html: htmlOutput.html,
    };
    sendEmail(mailOptions);
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
      user.bookmarks = [...user.bookmarks, mongoose.Types.ObjectId(tweetId)];
    } else {
      user.bookmarks = removeObjectIdFromArr(user.bookmarks, tweetId);
    }
    await user.save();
    res.status(200).json({ data: { user } });
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
    const tweet = await getTweetById(tweetId);
    if (!includesObjectId(user.likes, tweetId)) {
      user.likes = [...user.likes, mongoose.Types.ObjectId(tweetId)];
      tweet.likes += 1;
    } else {
      user.likes = removeObjectIdFromArr(user.likes, tweetId);
      tweet.likes -= 1;
    }
    await tweet.save();
    await user.save();
    res.status(200).json({ data: { user } });
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
      authenticatedUser.following = [
        ...authenticatedUser.following,
        mongoose.Types.ObjectId(userId),
      ];
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
    res.status(200).json({ data: { authenticatedUser } });
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

export const getUserLikes = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const user = await getUserById(userId);
    const populatedUser = await user.populate('likes.source').execPopulate();
    const { likes } = populatedUser;
    res.status(200).json({ data: { likes } });
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

export const getUserFeed = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req;
    const sort = req.query.sort || 'top';
    const sortString = getSortString(sort);
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10) || 1;
    const user = await getUserById(userId);
    const { SERVER_URL } = process.env;
    const { following } = user;
    const tweets = await Tweet.find()
      .countDocuments()
      .find({ user: { $in: following } })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const tweetsCount =
      (await Tweet.find({ user: { $in: following } }).countDocuments()) -
      page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (tweetsCount > 0) {
      links.next = `${SERVER_URL}/users/users/tweets/feed?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/user/tweets/feed?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({
      data: {
        tweets,
        links,
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
