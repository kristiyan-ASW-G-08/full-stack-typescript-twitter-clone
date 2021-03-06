import CommonTweet from '@twtr/common/source/types/Tweet';
import User from 'types/User';

export default interface Tweet extends CommonTweet {
  user: User;
  retweet?: Tweet;
  reply?: {
    _id: string;
    user: User;
  };
  _id: string;
}
