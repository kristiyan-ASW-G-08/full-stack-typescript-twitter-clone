import { Request, Response, NextFunction } from 'express';
import createTweet from '@services/tweetServices';
import passErrorToNext from '@utilities/passErrorToNext';

export const postTweet = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { text } = req.body;
    const { userId } = req;
    const tweetId = await createTweet(text, userId);
    res.status(200).json({ data: { tweetId } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export default postTweet;
