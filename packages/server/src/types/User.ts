import mongoose, { Document } from 'mongoose';
import CommonUser from '@twtr/common/source/types/User';

export default interface User extends CommonUser, Document {
  password: string;
  confirmed: boolean;
  following: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  retweets: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  bookmarks: mongoose.Types.ObjectId[];
}
