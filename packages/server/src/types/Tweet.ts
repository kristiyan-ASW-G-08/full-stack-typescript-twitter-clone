import CommonTweet from '@twtr/common/types/Tweet';
import { Schema, Document } from 'mongoose';

export default interface Tweet extends CommonTweet, Document {
  user: Schema.Types.ObjectId;
}
