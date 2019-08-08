import Tweet from '@models/Tweet';
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
