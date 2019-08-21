import mongoose from 'mongoose';

export default interface SourceRef {
  source: mongoose.Types.ObjectId;
  ref: 'Tweet' | 'Reply';
}
