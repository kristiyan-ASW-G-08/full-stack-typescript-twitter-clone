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
  },
  email: { required: true, type: String, minlength: 3, unique: true },
  password: { required: true, type: String, minlength: 12 },
  website: { required: false, type: String, minlength: 3 },
  confirmed: { required: false, type: Boolean, default: false },
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
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: {
        type: String,
        required: true,
        enum: ['Tweet', 'Reply'],
      },
    },
  ],
  bookmarks: [
    {
      type: Schema.Types.ObjectId,
      ref: {
        type: String,
        required: true,
        enum: ['Tweet', 'Reply'],
      },
    },
  ],
});

export default mongoose.model<User>('User', UserSchema);
