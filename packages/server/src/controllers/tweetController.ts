import { Request, Response, NextFunction } from 'express';
import {
  createTweet,
  createLinkTweet,
  createImageTweet,
  getTweetById,
} from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';
import { CustomError, errors } from '@utilities/CustomError';
import isAuthorized from '@utilities/isAuthorized';
import ValidationError from '@twtr/common/source/types/ValidationError';

export const postTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { text, linkUrl, type } = req.body;
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
    }
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
    await tweet.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};
