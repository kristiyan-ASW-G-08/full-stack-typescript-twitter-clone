import mongoose, { Schema } from 'mongoose';
import User from '../types/User';
import duplicationErrorHandler from '../middleware/duplicationErrorHandler';
//@ts-ignore
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema: Schema = new Schema({
  username: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 50,
    unique: true,
  },
  handle: {
    required: true,
    type: String,
    minlength: 1,
    maxlength: 50,
    unique: true,
  },
  email: { required: true, type: String, minlength: 3, unique: true },
  password: { required: true, type: String, minlength: 12 },
  isConfirmed: { type: Boolean, default: true },
  avatar: {
    type: String,
  },
  cover: { type: String },
  date: {
    type: Date,
    default: Date.now,
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  followers: {
    type: Number,
    default: 0,
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  ],
  retweets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  ],
  replies: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  ],

  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  ],
});

UserSchema.index({ handle: 'text' });

UserSchema.plugin(uniqueValidator);

export default mongoose.model<User>('User', UserSchema);
