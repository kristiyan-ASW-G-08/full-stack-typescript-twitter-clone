import Tweet from './Tweet';
import TweetType from '../types/Tweet';
import getResource from '../utilities/getResource';

export const getTweetById = async (tweetId: string): Promise<TweetType> =>
  getResource<TweetType>(Tweet, { name: '_id', value: tweetId });

export default getTweetById;
