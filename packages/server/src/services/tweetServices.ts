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

export const getTweets = async (
  sort: string,
  limit: number,
  page: number,
): Promise<{ tweets: TweetType[]; tweetsCount: number }> => {
  let sortString: string;
  switch (sort) {
    case 'top':
      sortString = '-likes';
      break;
    case 'trending':
      sortString = '-retweets';
      break;
    case 'new':
      sortString = '-date';
      break;
    case 'comments':
      sortString = '-comments';
      break;
    default:
      sortString = '-likes';
      break;
  }
  const tweets = await Tweet.countDocuments()
    .find()
    .sort(sortString)
    .skip((page - 1) * limit)
    .limit(limit);
  const tweetsCount = (await Tweet.countDocuments()) - page * limit;
  return { tweets, tweetsCount };
};

export const getTweetsByUserId = async (
  sort: string,
  limit: number,
  page: number,
  userId: string,
): Promise<{ tweets: TweetType[]; tweetsCount: number }> => {
  let sortString: string;
  switch (sort) {
    case 'top':
      sortString = '-likes';
      break;
    case 'trending':
      sortString = '-retweets';
      break;
    case 'new':
      sortString = '-date';
      break;
    case 'comments':
      sortString = '-comments';
      break;
    default:
      sortString = '-likes';
      break;
  }
  const tweets = await Tweet.countDocuments()
    .find({ user: userId })
    .sort(sortString)
    .skip((page - 1) * limit)
    .limit(limit);
  const tweetsCount = (await Tweet.countDocuments()) - page * limit;
  return { tweets, tweetsCount };
};
