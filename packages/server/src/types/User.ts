import CommonUser from '@twtr/common/source/types/User';
import { Schema, Document } from 'mongoose';

export default interface User extends CommonUser, Document {
  password: string;
  confirmed: boolean;
  following: Schema.Types.ObjectId[];
  likes: Schema.Types.ObjectId[];
  bookmarks: Schema.Types.ObjectId[];
}
