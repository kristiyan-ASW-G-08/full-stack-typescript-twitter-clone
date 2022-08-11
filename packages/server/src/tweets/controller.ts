import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Tweet from 'src/tweets/Tweet';
import { getTweetById } from 'src/tweets/services';
import passErrorToNext from '../utilities/passErrorToNext';
import isAuthorized from '../utilities/isAuthorized';
import deleteFile from '../utilities/deleteFile';
import includesId from '../utilities/includesId';
import removeId from '../utilities/removeId';
import { getUserById } from '../users/services';
import findDocs from '../utilities/findDocs';
import TweetType from '../types/Tweet';
import getPaginationURLs from '../utilities/getPaginationURLs';
import uploadToCloudinary from '../utilities/uploadToCloudinary';
import deleteCloudinaryFile from '../utilities/deleteFromCloudinary';

export const postTweet = async (
  { userId, body: { text, linkUrl, type, retweetId, replyId }, file }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await getUserById(userId);
    const tweet = new Tweet({
      text,
      user: userId,
      type,
      link: linkUrl,
    });

    if (file) {
      const { path, filename } = file;
      tweet.image = (await uploadToCloudinary(path, filename)).public_id;
      deleteFile(path);
    }

    if (retweetId) {
      const retweetedTweet = await getTweetById(retweetId);
      tweet.retweet = retweetId;
      if (includesId(user.retweets, retweetId)) {
        user.retweets = removeId(user.retweets, retweetId);
        retweetedTweet.retweets -= 1;
      } else {
        user.retweets = [...user.retweets, mongoose.Types.ObjectId(retweetId)];
        retweetedTweet.retweets += 1;
      }
      await retweetedTweet.save();
    }
    if (replyId) {
      const replyTweet = await getTweetById(replyId);
      tweet.reply = replyId;
      if (includesId(user.replies, replyId)) {
        user.replies = removeId(user.replies, replyId);
        replyTweet.replies -= 1;
      } else {
        user.replies = [...user.replies, mongoose.Types.ObjectId(replyId)];
        replyTweet.replies += 1;
      }
      await replyTweet.save();
    }

    await tweet.save();
    await user.save();
    res.status(201).json({ data: { tweetId: tweet._id } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchTweet = async (
  { userId, body: { text, linkUrl }, params: { tweetId }, file }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tweet = await getTweetById(tweetId);
    isAuthorized(tweet.user.toString(), userId);

    tweet.text = text;
    tweet.link = linkUrl;
    if (tweet.image && file) {
      const { path, filename } = file;
      await deleteCloudinaryFile(tweet.image);
      tweet.image = (await uploadToCloudinary(path, filename)).public_id;
      deleteFile(path);
    }
    await tweet.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const deleteTweet = async (
  { params: { tweetId }, userId }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tweet = await getTweetById(tweetId);
    isAuthorized(tweet.user.toString(), userId);
    const user = await getUserById(tweet.user, false);
    if (tweet.image) {
      await deleteCloudinaryFile(tweet.image);
    }
    if (tweet.type === 'reply') {
      const repliedToTweet = await getTweetById(tweet.reply);
      user.replies = removeId(user.replies, tweet.reply);
      repliedToTweet.replies -= 1;
      await repliedToTweet.save();
    }
    if (tweet.type === 'retweet') {
      const repliedToTweet = await getTweetById(tweet.reply);
      user.retweets = removeId(user.retweets, tweet.reply);
      repliedToTweet.retweets -= 1;
      await repliedToTweet.save();
    }
    await tweet.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getTweet = async (
  { params: { tweetId } }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const tweet = await getTweetById(tweetId);
    const populatedTweet = await tweet
      .populate([
        { path: 'user', select: 'username handle avatar' },
        { path: 'reply', select: 'user' },
        { path: 'retweet' },
      ])
      .execPopulate();
    res.status(200).json({ data: { tweet: populatedTweet } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getAllTweets = async (
  { pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort } = pagination;
    const { documents, count } = await findDocs<TweetType>({
      model: Tweet,
      pagination,
      query: {},
    });
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: 'tweets',
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

export const getUserTweets = async (
  { params: { userId }, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort } = pagination;
    const { documents, count } = await findDocs<TweetType>({
      model: Tweet,
      pagination,
      query: { user: userId },
    });

    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/${userId}/tweets`,
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

export const getReplies = async (
  { params: { tweetId }, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort } = pagination;
    const { documents, count } = await findDocs<TweetType>({
      model: Tweet,
      pagination,
      query: { reply: tweetId },
    });
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `tweets/${tweetId}/replies`,
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

export const getUserReplies = async (
  { params: { userId }, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { page, limit, sort } = pagination;
    const { documents, count } = await findDocs<TweetType>({
      model: Tweet,
      pagination,
      query: { user: userId, type: 'reply' },
    });
    const { prevPage, nextPage } = getPaginationURLs({
      page,
      urlExtension: `users/${userId}/replies`,
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
