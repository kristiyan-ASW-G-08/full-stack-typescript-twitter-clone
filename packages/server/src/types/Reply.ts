import CommonReply from '@twtr/common/source/types/Reply';
import { Document } from 'mongoose';

export default interface Reply extends CommonReply, Document {
  user: string;
  tweet: string;
}
