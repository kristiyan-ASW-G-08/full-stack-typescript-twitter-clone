import { NextFunction } from 'express';
import mongoose, { Schema } from 'mongoose';
import Tweet from '@customTypes/Tweet';

const TweetSchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['text', 'image', 'retweet'] },
  text: { type: String, minlength: 1, maxlength: 100 },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  retweets: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now,
  },
});

TweetSchema.pre('find', function(next: NextFunction): void {
  this.populate([
    { path: 'user', select: 'username' },
    { path: 'community', select: 'name description subscribers theme' },
  ]);
  next();
});
export default mongoose.model<Tweet>('Tweet', TweetSchema);
