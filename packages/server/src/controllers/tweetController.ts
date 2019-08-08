import { Request, Response, NextFunction } from 'express';
import {
  createTweet,
  createLinkTweet,
  createImageTweet,
} from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';
import { CustomError, errors } from '@utilities/CustomError';
import ValidationError from '@twtr/common/types/ValidationError';

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
    }
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export default postTweet;
