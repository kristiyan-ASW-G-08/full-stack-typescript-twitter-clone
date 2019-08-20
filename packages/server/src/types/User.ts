import CommonUser from '@twtr/common/source/types/User';
import mongoose, { Document } from 'mongoose';

export default interface User extends CommonUser, Document {
  password: string;
  confirmed: boolean;
  following: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  bookmarks: { source: mongoose.Types.ObjectId; ref: 'Tweet' | 'Reply' }[];
}
