import mongoose, { Schema, Query } from 'mongoose';
import Tweet from '../types/Tweet';

export const TweetSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'link', 'retweet', 'reply'],
  },
  text: { type: String, maxlength: 500 },
  image: { type: String },
  link: { type: String },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  retweet: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
  },
  reply: { type: Schema.Types.ObjectId, ref: 'Tweet' },
  retweets: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now,
  },
});
//@ts-ignore
async function populateFields(this: Query<any>): Promise<void> {
  this.populate([
    { path: 'user', select: 'username handle avatar' },
    { path: 'reply', select: 'user' },
    { path: 'retweet' },
  ]);
}

TweetSchema.pre('find', populateFields);

TweetSchema.pre('populate', populateFields);

export default mongoose.model('Tweet', TweetSchema);
