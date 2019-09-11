import CommonTweet from '@twtr/common/source/types/Tweet';
import mongoose, { Document } from 'mongoose';

interface PopulatedUser {
  username: string;
  handle: string;
  _id: mongoose.Types.ObjectId;
}
export default interface Tweet extends CommonTweet, Document {
  user: string;
  retweet: string;
}
