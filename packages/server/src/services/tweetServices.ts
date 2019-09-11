import Tweet from '@models/Tweet';
import TweetType from '@customTypes/Tweet';
import ValidationError from '@twtr/common/source/types/ValidationError';
import { CustomError, errors } from '@utilities/CustomError';

export const getTweetById = async (tweetId: string): Promise<TweetType> => {
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
  return tweet;
};

export default getTweetById;
