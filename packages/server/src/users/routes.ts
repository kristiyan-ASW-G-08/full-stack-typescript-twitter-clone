import express from 'express';
import multer from 'multer';
import {
  signUp,
  logIn,
  verifyEmail,
  requestPasswordResetEmail,
  resetPassword,
  deleteUser,
  bookmarkTweet,
  likeTweet,
  followUser,
  getUserBookmarks,
  patchProfile,
  getUsersList,
  getUserLikes,
  getUserFeed,
  getUser,
  getUserFollowing,
  getUserFollowers,
} from 'src/users/controller';
import validationHandler from '..//middleware/validationHandler';
import authenticationHandler from '..//middleware/authenticationHandler';
import validators from '@twtr/common/source/schemaValidators/validators';
import paginationHandler from '..//middleware/paginationHandler';
import fileFilter from '../middleware/fileFilter';
import storage from '../middleware/fileStorage';

const router = express.Router();

router.post(
  '/users',
  validationHandler([
    { schema: validators.UserSignUpValidator, target: 'body' },
  ]),
  signUp,
);

router.post(
  '/users/user/tokens',
  validationHandler([
    { schema: validators.UserLoginValidator, target: 'body' },
  ]),
  logIn,
);

router.post(
  '/users/user',
  validationHandler([{ schema: validators.EmailValidator, target: 'body' }]),
  requestPasswordResetEmail,
);

router.patch('/users/user/:token/confirm', verifyEmail);

router.patch(
  '/users/user/reset',
  authenticationHandler,
  validationHandler([
    { schema: validators.ResetPasswordValidator, target: 'body' },
  ]),
  resetPassword,
);

router.patch(
  '/users/user/profile',
  authenticationHandler,
  multer({ storage, fileFilter }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  validationHandler([
    { schema: validators.UserProfileValidator, target: 'body' },
  ]),

  patchProfile,
);

router.patch(
  '/users/tweets/:tweetId/bookmark',
  authenticationHandler,
  bookmarkTweet,
);

router.patch('/users/tweets/:tweetId/like', authenticationHandler, likeTweet);

router.patch('/users/:userId', authenticationHandler, followUser);

router.delete('/users', authenticationHandler, deleteUser);

router.get(
  '/users/user/bookmarks',
  authenticationHandler,
  validationHandler([
    { schema: validators.SortStringValidator, target: 'query' },
  ]),
  paginationHandler,
  getUserBookmarks,
);

router.get(
  '/users/:userId/likes',
  validationHandler([
    { schema: validators.SortStringValidator, target: 'query' },
  ]),
  paginationHandler,
  getUserLikes,
);

router.get(
  '/users/:handle',
  validationHandler([
    { schema: validators.UserHandleValidator, target: 'params' },
  ]),
  getUsersList,
);

router.get(
  '/users/user/tweets',
  authenticationHandler,
  validationHandler([
    { schema: validators.SortStringValidator, target: 'query' },
  ]),
  paginationHandler,
  getUserFeed,
);

router.get('/users/user/:userId', getUser);

router.get(
  '/users/:userId/following',
  validationHandler([
    { schema: validators.SortStringValidator, target: 'query' },
  ]),
  paginationHandler,
  getUserFollowing,
);

router.get(
  '/users/:userId/followers',
  validationHandler([
    { schema: validators.SortStringValidator, target: 'query' },
  ]),
  paginationHandler,
  getUserFollowers,
);

export default router;
