import mongoose, { Schema } from 'mongoose';
import User from '@customTypes/User';

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
    text: true,
  },
  email: { required: true, type: String, minlength: 3, unique: true },
  password: { required: true, type: String, minlength: 12 },
  website: { required: false, type: String, minlength: 3 },
  confirmed: { type: Boolean, default: false },
  profilePhoto: { type: String },
  headerPhoto: { type: String },
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
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
  ],
});

UserSchema.index({ handle: 'text' });

export default mongoose.model<User>('User', UserSchema);
