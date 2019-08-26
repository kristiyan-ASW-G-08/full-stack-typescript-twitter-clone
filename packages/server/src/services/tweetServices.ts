import Tweet from '@models/Tweet';
import TweetType from '@customTypes/Tweet';
import ValidationError from '@twtr/common/source/types/ValidationError';
import { CustomError, errors } from '@utilities/CustomError';

export const createTweet = async (
  text: string,
  userId: string,
): Promise<{ tweetId: string }> => {
  const tweet = new Tweet({
    text,
    user: userId,
    type: 'text',
  });
  await tweet.save();
  const tweetId = tweet._id;
  return { tweetId };
};
export const createRetweet = async (
  text: string,
  retweetedId: string,
  userId: string,
): Promise<{ tweetId: string }> => {
  const tweet = new Tweet({
    text,
    user: userId,
    retweet: retweetedId,
    type: 'retweet',
  });
  await tweet.save();
  const tweetId = tweet._id;
  return { tweetId };
};
export const createImageTweet = async (
  text: string,
  imagePath: string,
  userId: string,
): Promise<{ tweetId: string }> => {
  const tweet = new Tweet({
    text,
    image: imagePath,
    user: userId,
    type: 'image',
  });
  await tweet.save();
  const tweetId = tweet._id;
  return { tweetId };
};

export const createLinkTweet = async (
  text: string,
  link: string,
  userId: string,
): Promise<{ tweetId: string }> => {
  const tweet = new Tweet({
    text,
    link,
    user: userId,
    type: 'text',
  });
  await tweet.save();
  const tweetId = tweet._id;
  return { tweetId };
};

export const getTweetById = async (
  tweetId: string,
): Promise<{ tweet: TweetType }> => {
  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    const validationErrorsArr: ValidationError[] = [
      {
        name: '',
        message: 'Tweet does not exist',
      },
    ];
    const { status, message } = errors.NotFound;
    const error = new CustomError(status, message, validationErrorsArr);
    throw error;
  }
  return { tweet };
};
