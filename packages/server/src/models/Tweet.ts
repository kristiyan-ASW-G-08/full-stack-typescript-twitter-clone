import mongoose, { Schema } from 'mongoose';
import Tweet from '@customTypes/Tweet';

const TweetSchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['text', 'image', 'link', 'retweet'],
  },
  text: { type: String, minlength: 1, maxlength: 500 },
  image: { type: String, minlength: 1 },
  link: { type: String, minlength: 1 },
  retweet: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  retweets: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  replies: { type: Number, default: 0 },
  date: {
    type: Date,
    default: Date.now,
  },
});

TweetSchema.pre('find', async function(): Promise<any> {
  this.populate([{ path: 'user', select: 'username handle' }]);
});

export default mongoose.model<Tweet>('Tweet', TweetSchema);
