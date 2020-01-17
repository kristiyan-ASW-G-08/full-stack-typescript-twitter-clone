import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mjml2html from 'mjml';
import { getUserByEmail, getUserById } from 'src/users/services';
import { getTweetById } from 'src/tweets/services';
import passErrorToNext from '@utilities/passErrorToNext';
import includesId from '@src/utilities/includesId';
import removeId from '@utilities/removeId';
import MailOptions from '@customTypes/MailOptions';
import User from 'src/users/User';
import Tweet from 'src/tweets/Tweet';
import RESTError, { errors } from '@utilities/RESTError';
import sendEmail from '@utilities/sendEmail';
import deleteFile from '@src/utilities/deleteFile';
import findDocs from '@utilities/findDocs';
import renderUrl from '@utilities/renderUrl';
import hasConfirmedEmail from '@utilities/hasConfirmedEmail';
import TweetType from '@customTypes/Tweet';
import UserType from '@customTypes/User';

export const signUp = async (
  { body: { username, handle, email, password } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { _id } = await new User({
      username,
      handle,
      email,
      password: await bcrypt.hash(password, 12),
    }).save();
    const { EMAIL, CLIENT_URL, SECRET } = process.env;
    const token = jwt.sign(
      {
        userId: _id,
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
  { body: { email, password } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { SECRET } = process.env;
    const user = await getUserByEmail(email);
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      const { status, message } = errors.Unauthorized;
      throw new RESTError(status, message, [
        {
          path: 'password',
          message: 'Wrong password. Try again',
        },
      ]);
    }
    hasConfirmedEmail(user.confirmed);
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
  { params: { token } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { SECRET } = process.env;
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
  { body: { email } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await getUserByEmail(email);
    hasConfirmedEmail(user.confirmed);
    const { EMAIL, CLIENT_URL, SECRET } = process.env;
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
    const count = bookmarks.length - page * limit;

    const nextPage =
      count > 0
        ? renderUrl(SERVER_URL, `users/user/bookmarks`, {
            page: page + 1,
            limit,
            sort,
          })
        : null;

    const prev =
      page > 1
        ? renderUrl(SERVER_URL, `users/user/bookmarks`, {
            page: page - 1,
            limit,
            sort,
          })
        : null;

    res.status(200).json({
      data: {
        tweets: bookmarks,
        links: {
          next: nextPage,
          prev,
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
    const count = likes.length - page * limit;

    const nextPage =
      count > 0
        ? renderUrl(SERVER_URL, `users/${userId}/likes`, {
            page: page + 1,
            limit,
            sort,
          })
        : null;

    const prev =
      page > 1
        ? renderUrl(SERVER_URL, `users/${userId}/likes`, {
            page: page - 1,
            limit,
            sort,
          })
        : null;
    res.status(200).json({
      data: {
        tweets: likes,
        links: {
          next: nextPage,
          prev,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchProfile = async (
  { body: { username, handle, website }, userId, files }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
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
      .select({ score: { $meta: 'textScore' } })
      .limit(10)
      .exec();
    res.status(200).json({ data: { users } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserFeed = async (
  { userId, pagination: { page, limit, sort, sortString } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { following } = await getUserById(userId);
    const { SERVER_URL } = process.env;
    const { documents, count } = await findDocs<
      TweetType,
      { user: { [key: string]: mongoose.Types.ObjectId[] } }
    >(Tweet, page, limit, sortString, { user: { $in: following } });

    const nextPage =
      count > 0
        ? renderUrl(SERVER_URL, `users/user/tweets`, {
            page: page + 1,
            limit,
            sort,
          })
        : null;

    const prev =
      page > 1
        ? renderUrl(SERVER_URL, `users/user/tweets`, {
            page: page - 1,
            limit,
            sort,
          })
        : null;
    res.status(200).json({
      data: {
        tweets: documents,
        links: {
          next: nextPage,
          prev,
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

    const nextPage =
      count > 0
        ? renderUrl(SERVER_URL, `users/${userId}/following?`, {
            page: page + 1,
            limit,
            sort,
          })
        : null;

    const prev =
      page > 1
        ? renderUrl(SERVER_URL, `users/${userId}/following?`, {
            page: page - 1,
            limit,
            sort,
          })
        : null;
    res.status(200).json({
      data: {
        users: following,
        links: {
          next: nextPage,
          prev,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserFollowers = async (
  {
    params: { userId },
    pagination: { page, limit, sort, sortString },
  }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { SERVER_URL } = process.env;
    const { documents, count } = await findDocs<
      UserType,
      { following: { $in: [string] } }
    >(User, page, limit, sortString, {
      following: { $in: [userId] },
    });

    const nextPage =
      count > 0
        ? renderUrl(SERVER_URL, `users/${userId}/followers?`, {
            page: page + 1,
            limit,
            sort,
          })
        : null;

    const prev =
      page > 1
        ? renderUrl(SERVER_URL, `users/${userId}/followers?`, {
            page: page - 1,
            limit,
            sort,
          })
        : null;
    res.status(200).json({
      data: {
        users: documents,
        links: {
          next: nextPage,
          prev,
        },
      },
    });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
