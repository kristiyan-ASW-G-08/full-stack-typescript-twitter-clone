import CommonTweet from '@twtr/common/source/types/Tweet';
import { Document } from 'mongoose';

export default interface Tweet extends CommonTweet, Document {
  user: string;
  retweet: string;
  reply: string;
}
