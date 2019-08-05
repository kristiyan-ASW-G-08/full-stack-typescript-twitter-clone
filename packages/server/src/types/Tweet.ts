import CommonTweet from '@twtr/common/types/Tweet';
import mongoose, { Document } from 'mongoose';

export default interface Tweet extends CommonTweet, Document {
  user: string;
}
