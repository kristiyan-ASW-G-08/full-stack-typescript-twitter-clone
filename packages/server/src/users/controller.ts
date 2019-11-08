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
} from 'src/users/services';
import { getTweetById } from 'src/tweets/services';
import passErrorToNext from '@utilities/passErrorToNext';
import includesId from '@src/utilities/includesId';
import removeId from '@utilities/removeId';
import MailOptions from '@customTypes/MailOptions';
import User from 'src/users/User';
import Tweet from 'src/tweets/Tweet';
import { CustomError, errors } from '@utilities/CustomError';
import sendEmail from '@utilities/sendEmail';
import ValidationError from '@twtr/common/source/types/ValidationError';
import deleteFile from '@src/utilities/deleteFile';

export const signUp = async (
  { body }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, handle, email, password } = body;
    const credentials: {
      path: 'username' | 'handle' | 'email';
      value: string;
    }[] = [
      { path: 'username', value: username },
      { path: 'handle', value: handle },
      { path: 'email', value: email },
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
    const { EMAIL, CLIENT_URL, SECRET } = process.env;
    const { status, message } = errors.InternalServerError;
    if (!SECRET) {
      const error = new CustomError(status, message);
      throw error;
    }
    if (!EMAIL) {
      const error = new CustomError(status, message);
      throw error;
    }
    const token = jwt.sign(
      {
        userId,
      },
      SECRET,
      { expiresIn: '1h' },
    );
    const url = `${CLIENT_URL}/confirmation/${token}`;
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
      from: EMAIL,
      to: email,
      subject: 'TwittClone Email Confirmation',
      html: htmlOutput.html,
    };
    sendEmail(mailOptions);
    res.sendStatus(201);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const logIn = async (
  { body }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = body;
    const { SECRET } = process.env;
    const user = await getUserByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const validationErrorsArr: ValidationError[] = [
        {
          path: 'password',
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
      SECRET,
      { expiresIn: '1h' },
    );
    const {
      username,
      handle,
      following,
      likes,
      bookmarks,
      date,
      replies,
      retweets,
      _id,
      website,
      cover,
      avatar,
    } = user;
    res.status(200).json({
      data: {
        token,
        user: {
          website,
          username,
          handle,
          following,
          likes,
          bookmarks,
          email,
          date,
          replies,
          retweets,
          _id,
          cover,
          avatar,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const verifyEmail = async (
  { params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { SECRET } = process.env;
    const { token } = params;
    const decodedToken = jwt.verify(token, SECRET);
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
  { body }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email } = body;
    const user = await getUserByEmail(email);
    await checkUserConfirmation(user);
    const { EMAIL, CLIENT_URL, SECRET } = process.env;
    const { status, message } = errors.InternalServerError;
    if (!SECRET) {
      const error = new CustomError(status, message);
      throw error;
    }
    if (!EMAIL) {
      const error = new CustomError(status, message);
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id,
      },
      SECRET,
      { expiresIn: '1h' },
    );
    const url = `${CLIENT_URL}/reset/${token}`;
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
      from: EMAIL,
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
  { userId, body }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { password } = body;
    const user = await getUserById(userId);
    user.password = await bcrypt.hash(password, 12);
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const deleteUser = async (
  { userId }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await getUserById(userId);
    await user.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const bookmarkTweet = async (
  { userId, params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = params;
    const user = await getUserById(userId, false);
    if (!includesId(user.bookmarks, tweetId)) {
      user.bookmarks = [...user.bookmarks, mongoose.Types.ObjectId(tweetId)];
    } else {
      user.bookmarks = removeId(user.bookmarks, tweetId);
    }
    await user.save();
    res.status(200).json({ data: { user } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const likeTweet = async (
  { userId, params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = params;
    const user = await getUserById(userId, false);
    const tweet = await getTweetById(tweetId);
    if (includesId(user.likes, tweetId)) {
      user.likes = removeId(user.likes, tweetId);
      tweet.likes -= 1;
    } else {
      user.likes = [...user.likes, mongoose.Types.ObjectId(tweetId)];
      tweet.likes += 1;
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
    const user = await getUserById(userId, false);
    const authenticatedUser = await getUserById(authenticatedUserId);
    if (includesId(authenticatedUser.following, userId)) {
      authenticatedUser.following = removeId(
        authenticatedUser.following,
        userId,
      );
      user.followers -= 1;
    } else {
      authenticatedUser.following = [
        ...authenticatedUser.following,
        mongoose.Types.ObjectId(userId),
      ];
      user.followers += 1;
    }
    await user.save();
    await authenticatedUser.save();
    res.status(200).json({ data: { user: authenticatedUser } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserBookmarks = async (
  { userId, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort, sortString } = pagination;
    const user = await getUserById(userId);
    const { SERVER_URL } = process.env;
    const populatedUser = await user
      .populate({
        path: 'bookmarks',
        options: {
          sort: sortString,
          skip: (page - 1) * limit,
          limit,
        },
      })
      .execPopulate();
    const { bookmarks } = populatedUser;
    const bookmarksCount = bookmarks.length - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (bookmarksCount > 0) {
      links.next = `${SERVER_URL}/users/user/bookmarks?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/user/bookmarks?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { tweets: bookmarks, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserLikes = async (
  { pagination, params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = params;
    const { page, limit, sort, sortString } = pagination;
    const { SERVER_URL } = process.env;
    const user = await getUserById(userId);
    const populatedUser = await user
      .populate({
        path: 'likes',
        options: {
          sort: sortString,
          skip: (page - 1) * limit,
          limit,
        },
      })
      .execPopulate();
    const { likes } = populatedUser;
    const likesCount = likes.length - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (likesCount > 0) {
      links.next = `${SERVER_URL}/users/${userId}/likes?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/${userId}/likes?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { tweets: likes, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchProfile = async (
  { body, userId, files }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { username, handle, website } = body;
    const credentials: {
      path: 'username' | 'handle' | 'email';
      value: string;
    }[] = [
      { path: 'username', value: username },
      { path: 'handle', value: handle },
    ];
    await areCredentialsAvailable(credentials, userId);
    const user = await getUserById(userId, false);

    if (!Array.isArray(files) && files && files.avatar) {
      deleteFile(user.avatar);
      user.avatar = `${process.env.SERVER_URL}/${files.avatar[0].path}`;
    }
    if (!Array.isArray(files) && files && files.cover) {
      deleteFile(user.cover);
      user.cover = `${process.env.SERVER_URL}/${files.cover[0].path}`;
    }
    user.username = username;
    user.handle = handle;
    user.website = website;
    await user.save();
    res.status(200).json({ data: { user } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUsersList = async (
  { params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { handle } = params;
    const searchRegex = new RegExp(handle, 'gi');
    const users = await User.find(
      {
        handle: { $regex: searchRegex },
      },
      'username handle avatar cover',
    )
      .select({ score: { $meta: 'textScore' } })
      .limit(10)
      .exec();
    res.status(200).json({ data: { users } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserFeed = async (
  { userId, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort, sortString } = pagination;
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
      (await Tweet.countDocuments({ user: { $in: following } })) - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (tweetsCount > 0) {
      links.next = `${SERVER_URL}/users/user/tweets?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/user/tweets?page=${page -
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

export const getUser = async (
  { params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = params;
    const user = await getUserById(userId, false);
    res.status(200).json({
      data: {
        user,
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserFollowing = async (
  { params, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort, sortString } = pagination;
    const { userId } = params;
    const user = await getUserById(userId);
    const { SERVER_URL } = process.env;
    const populatedUser = await user
      .populate({
        path: 'following',
        options: {
          sort: sortString,
          skip: (page - 1) * limit,
          limit,
          select: 'username handle avatar cover website following followers',
        },
      })
      .execPopulate();
    const { following } = populatedUser;
    const count = following.length - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (count > 0) {
      links.next = `${SERVER_URL}/users/${userId}/following?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/${userId}/following?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({
      data: {
        users: following,
        links,
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserFollowers = async (
  { params, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort, sortString } = pagination;
    const { userId } = params;
    const { SERVER_URL } = process.env;
    const users = await User.countDocuments()
      .find({
        following: { $in: [userId] },
      })
      .sort(sortString)
      .select('username handle avatar cover website following followers')
      .skip((page - 1) * limit)
      .limit(limit);
    const usersCount =
      (await User.countDocuments({
        following: { $in: [userId] },
      })) -
      page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (usersCount > 0) {
      links.next = `${SERVER_URL}/users/${userId}/followers?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/${userId}/followers?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({
      data: {
        users,
        links,
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
