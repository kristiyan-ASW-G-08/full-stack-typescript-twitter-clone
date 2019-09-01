import { Request, Response, NextFunction } from 'express';
import Tweet from '@models/Tweet';
import {
  createTweet,
  createLinkTweet,
  createImageTweet,
  createRetweet,
  getTweetById,
} from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';
import { CustomError, errors } from '@utilities/CustomError';
import isAuthorized from '@utilities/isAuthorized';
import deleteFile from '@utilities/deleteFile';
import getSortString from '@utilities/getSortString';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const postTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { text, linkUrl, type, retweetedId } = req.body;
    const { userId } = req;
    if (type === 'text') {
      const { tweetId } = await createTweet(text, userId);
      res.status(200).json({ data: { tweetId } });
    } else if (type === 'link') {
      const { tweetId } = await createLinkTweet(text, linkUrl, userId);
      res.status(200).json({ data: { tweetId } });
    } else if (type === 'image') {
      if (!req.file) {
        const errorData: ValidationError[] = [
          {
            name: 'image',
            message: 'Upload an image',
          },
        ];
        const { status, message } = errors.BadRequest;
        const error = new CustomError(status, message, errorData);
        throw error;
      }
      const { tweetId } = await createImageTweet(text, req.file.path, userId);
      res.status(200).json({ data: { tweetId } });
    } else if (type === 'retweet') {
      const { tweetId } = await createRetweet(text, retweetedId, userId);
      res.status(200).json({ data: { tweetId } });
    }
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const updateTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const { userId } = req;
    const { tweet } = await getTweetById(tweetId);
    const { text, linkUrl } = req.body;
    isAuthorized(tweet.user.toString(), userId);
    if (tweet.type === 'text') {
      tweet.text = text;
    } else if (tweet.type === 'link') {
      if (tweet.text) {
        tweet.text = text;
      }
      tweet.link = linkUrl;
    } else if (tweet.type === 'image') {
      if (!req.file) {
        const errorData: ValidationError[] = [
          {
            name: 'image',
            message: 'Upload an image',
          },
        ];
        const { status, message } = errors.BadRequest;
        const error = new CustomError(status, message, errorData);
        throw error;
      }
      await deleteFile(tweet.image);
      if (tweet.text) {
        tweet.text = text;
      }
      tweet.image = req.file.path;
    }

    await tweet.save();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const deleteTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const { userId } = req;
    const { tweet } = await getTweetById(tweetId);
    isAuthorized(tweet.user.toString(), userId);
    if (tweet.type === 'image') {
      await deleteFile(tweet.image);
    }

    await tweet.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const { tweet } = await getTweetById(tweetId);
    res.status(200).json({ data: { tweet } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getAllTweets = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10) || 1;
    const { SERVER_URL } = process.env;
    const sortString = getSortString(sort);
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
    const sortString = getSortString(sort);
    const tweets = await Tweet.countDocuments()
      .find({ user: userId })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const tweetsCount = (await Tweet.countDocuments()) - page * limit;
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
