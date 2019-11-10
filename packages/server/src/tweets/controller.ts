import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Tweet from 'src/tweets/Tweet';
import { getTweetById } from 'src/tweets/services';
import passErrorToNext from '@utilities/passErrorToNext';
import isAuthorized from '@utilities/isAuthorized';
import deleteFile from '@utilities/deleteFile';
import includesId from '@src/utilities/includesId';
import removeId from '@utilities/removeId';
import { getUserById } from 'src/users/services';

export const postTweet = async (
  { userId, body, file }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { text, linkUrl, type, retweetId, replyId } = body;
    const user = await getUserById(userId);
    const tweet = new Tweet({
      text,
      user: userId,
      type,
      link: linkUrl,
    });
    if (file) {
      tweet.image = `${process.env.SERVER_URL}/${file.path}`;
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
    const tweetId = tweet._id;
    res.status(201).json({ data: { tweetId } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const patchTweet = async (
  { userId, body, params, file }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = params;
    const { text, linkUrl } = body;
    const tweet = await getTweetById(tweetId);
    isAuthorized(tweet.user.toString(), userId);

    tweet.text = text;
    tweet.link = linkUrl;
    if (tweet.image && file) {
      await deleteFile(tweet.image);
      tweet.image = `${process.env.SERVER_URL}/${file.path}`;
    }
    await tweet.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const deleteTweet = async (
  { params, userId }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = params;
    const tweet = await getTweetById(tweetId);
    isAuthorized(tweet.user.toString(), userId);
    if (tweet.image) {
      await deleteFile(tweet.image);
    }
    await tweet.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getTweet = async (
  { params }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = params;
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
    const { page, limit, sort, sortString } = pagination;
    const { SERVER_URL } = process.env;
    const tweets = await Tweet.countDocuments()
      .find()
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const tweetsCount = (await Tweet.countDocuments()) - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (tweetsCount > 0) {
      links.next = `${SERVER_URL}/tweets?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/tweets?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { tweets, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserTweets = async (
  { params, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = params;
    const { page, limit, sort, sortString } = pagination;
    const { SERVER_URL } = process.env;
    const tweets = await Tweet.countDocuments()
      .find({ user: userId })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const tweetsCount =
      (await Tweet.countDocuments({ user: userId })) - page * limit;
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

export const getReplies = async (
  { params, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = params;
    const { page, limit, sort, sortString } = pagination;
    const { SERVER_URL } = process.env;
    const tweets = await Tweet.countDocuments()
      .find({ reply: tweetId })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const repliesCount =
      (await Tweet.countDocuments({ reply: tweetId })) - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (repliesCount > 0) {
      links.next = `${SERVER_URL}/tweets/${tweetId}/replies?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/tweets/${tweetId}/replies?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { tweets, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserReplies = async (
  { params, pagination }: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = params;
    const { page, limit, sort, sortString } = pagination;
    const { SERVER_URL } = process.env;
    const tweets = await Tweet.countDocuments()
      .find({ user: userId, type: 'reply' })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const tweetsCount =
      (await Tweet.countDocuments({ user: userId, type: 'reply' })) -
      page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (tweetsCount > 0) {
      links.next = `${SERVER_URL}/users/${userId}/replies?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/${userId}/replies?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { tweets, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
