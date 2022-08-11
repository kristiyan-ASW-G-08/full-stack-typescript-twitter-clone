import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mjml2html from 'mjml';
import { getUserByEmail, getUserById } from 'src/users/services';
import { getTweetById } from 'src/tweets/services';
import passErrorToNext from '../utilities/passErrorToNext';
import includesId from '../utilities/includesId';
import removeId from '../utilities/removeId';
import MailOptions from '../types/MailOptions';
import User from 'src/users/User';
import Tweet from 'src/tweets/Tweet';
import RESTError, { errors } from '../utilities/RESTError';
import sendEmail from '../utilities/sendEmail';
import findDocs from '../utilities/findDocs';
import hasConfirmedEmail from '../utilities/hasConfirmedEmail';
import getPaginationURLs from '../utilities/getPaginationURLs';
import TweetType from '../types/Tweet';
import UserType from '../types/User';
import uploadToCloudinary from '../utilities/uploadToCloudinary';
import deleteCloudinaryFile from '../utilities/deleteFromCloudinary';
import deleteFile from '../utilities/deleteFile';
import ValidationError from '@twtr/common/source/types/ValidationError';
import duplicationErrorHandler from '../middleware/duplicationErrorHandler';

export const signUp = async (
  { body: { username, handle, email, password } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await new User({
      username,
      handle,
      email,
      password: await bcrypt.hash(password, 12),
      // eslint-disable-next-line consistent-return
    })
      .save()
      .catch(err => duplicationErrorHandler(err, res));
    res.sendStatus(201);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const logIn = async (
  { body: { email, password } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { SECRET } = process.env;
    const user = await getUserByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const { status } = errors.Unauthorized;
      res.status(status).send({
        data: [
          {
            path: 'password',
            message: 'Wrong password. Try again',
          },
        ],
      });
    }
    hasConfirmedEmail(user.isConfirmed);
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
      cover,
      avatar,
    } = user;
    res.status(200).json({
      data: {
        token,
        user: {
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
  { params: { token } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // @ts-ignore
    const { userId } = jwt.verify(token, process.env.SECRET);
    const user = await getUserById(userId);
    user.isConfirmed = true;
    await user.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const requestPasswordResetEmail = async (
  { body: { email } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { _id, isConfirmed } = await getUserByEmail(email);
    hasConfirmedEmail(isConfirmed);
    const { EMAIL, CLIENT_URL, SECRET } = process.env;
    const token = jwt.sign(
      {
        userId: _id,
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
  { userId, body: { password } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
    await (await getUserById(userId)).remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const bookmarkTweet = async (
  { userId, params: { tweetId } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  { userId, params: { tweetId } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  { userId, pagination: { page, limit, sort, sortString } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await getUserById(userId);

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
    const count = bookmarks.length - page * limit;
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/user/bookmarks`,
      count,
      queries: {
        limit,
        sort,
      },
    });

    res.status(200).json({
      data: {
        tweets: bookmarks,
        links: {
          next: nextPage,
          prev: prevPage,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserLikes = async (
  {
    pagination: { page, limit, sort, sortString },
    params: { userId },
  }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
    const count = likes.length - page * limit;
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/${userId}/likes`,
      count,
      queries: {
        limit,
        sort,
      },
    });
    res.status(200).json({
      data: {
        tweets: likes,
        links: {
          next: nextPage,
          prev: prevPage,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchProfile = async (
  { body: { username, handle }, userId, files }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await getUserById(userId, false);
    if (!Array.isArray(files) && files && files.avatar) {
      const { filename, path } = files.avatar[0];
      if (user.avatar) {
        await deleteCloudinaryFile(user.avatar);
      }
      user.avatar = (await uploadToCloudinary(path, filename)).public_id;
      deleteFile(path);
    }
    if (!Array.isArray(files) && files && files.cover) {
      const { filename, path } = files.cover[0];
      if (user.cover) {
        await deleteCloudinaryFile(user.cover);
      }
      user.cover = (await uploadToCloudinary(path, filename)).public_id;
      deleteFile(path);
    }
    user.username = username;
    user.handle = handle;
    await user.save();
    res.status(200).json({ data: { user } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUsersList = async (
  { params: { handle } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const searchRegex = new RegExp(handle, 'gi');
    const users = await User.find(
      {
        handle: { $regex: searchRegex },
      },
      'username handle avatar cover',
    )
      .select([
        { $match: { $text: { $search: 'Pattern' } } },
        { score: { $meta: 'textScore' } },
      ])
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
    const { page, limit, sort } = pagination;
    const { following } = await getUserById(userId);

    const { documents, count } = await findDocs<
      TweetType,
      { user: { [key: string]: mongoose.Types.ObjectId[] } }
    >({
      model: Tweet,
      pagination,
      query: { user: { $in: following } },
    });

    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/user/tweets`,
      count,
      queries: {
        limit,
        sort,
      },
    });

    res.status(200).json({
      data: {
        tweets: documents,
        links: {
          next: nextPage,
          prev: prevPage,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUser = async (
  { params: { userId } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
  {
    params: { userId },
    pagination: { page, limit, sort, sortString },
  }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await getUserById(userId);

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
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/${userId}/following?`,
      count,
      queries: {
        limit,
        sort,
      },
    });
    res.status(200).json({
      data: {
        users: following,
        links: {
          next: nextPage,
          prev: prevPage,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserFollowers = async (
  { params: { userId }, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort } = pagination;

    const { documents, count } = await findDocs<
      UserType,
      { following: { $in: [string] } }
    >({
      model: User,
      pagination,
      query: {
        following: { $in: [userId] },
      },
    });
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/${userId}/followers?`,
      count,
      queries: {
        limit,
        sort,
      },
    });

    res.status(200).json({
      data: {
        users: documents,
        links: {
          next: nextPage,
          prev: prevPage,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
