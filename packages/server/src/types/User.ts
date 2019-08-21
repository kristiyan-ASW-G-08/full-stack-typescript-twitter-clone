import mongoose, { Document } from 'mongoose';
import CommonUser from '@twtr/common/source/types/User';
import SourceRef from '@customTypes/SourceRef';

export default interface User extends CommonUser, Document {
  password: string;
  confirmed: boolean;
  following: mongoose.Types.ObjectId[];
  likes: SourceRef[];
  bookmarks: SourceRef[];
}
