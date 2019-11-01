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
  patchCustomization,
} from 'src/users/controller';
import UserSignUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import UserProfileValidator from '@twtr/common/source/schemaValidators/UserProfileValidator';
import ResetPasswordValidator from '@twtr/common/source/schemaValidators/ResetPasswordValidator';
import SortStringValidator from '@twtr/common/source/schemaValidators/SortStringValidator';
import EmailValidator from '@twtr/common/source/schemaValidators/EmailValidator';
import UserHandleValidator from '@twtr/common/source/schemaValidators/UserHandleValidator';
import validate from '@customMiddleware/validate';
import isAuth from '@customMiddleware/isAuth';
import paginate from '@customMiddleware/paginate';
import fileFilter from '@customMiddleware/fileFilter';
import storage from '@customMiddleware/fileStorage';

const router = express.Router();

router.post(
  '/users',
  validate([{ schema: UserSignUpValidator, target: 'body' }]),
  signUp,
);

router.post(
  '/users/user/tokens',
  validate([{ schema: UserLoginValidator, target: 'body' }]),
  logIn,
);

router.post(
  '/users/user',
  validate([{ schema: EmailValidator, target: 'body' }]),
  requestPasswordResetEmail,
);

router.patch('/users/user/:token/confirm', verifyEmail);

router.patch(
  '/users/user/reset',
  isAuth,
  validate([{ schema: ResetPasswordValidator, target: 'body' }]),
  resetPassword,
);

router.patch(
  '/users/user/customization',
  isAuth,
  multer({ storage, fileFilter }).fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'cover', maxCount: 1 },
  ]),
  patchCustomization,
);

router.patch(
  '/users/user/profile',
  isAuth,
  validate([{ schema: UserProfileValidator, target: 'body' }]),
  patchProfile,
);

router.patch('/users/tweets/:tweetId/bookmark', isAuth, bookmarkTweet);

router.patch('/users/tweets/:tweetId/like', isAuth, likeTweet);

router.patch('/users/:userId', isAuth, followUser);

router.delete('/users', isAuth, deleteUser);

router.get(
  '/users/user/bookmarks',
  isAuth,
  validate([{ schema: SortStringValidator, target: 'query' }]),
  paginate,
  getUserBookmarks,
);

router.get(
  '/users/:userId/likes',
  validate([{ schema: SortStringValidator, target: 'query' }]),
  paginate,
  getUserLikes,
);

router.get(
  '/users/:handle',
  validate([{ schema: UserHandleValidator, target: 'params' }]),
  getUsersList,
);

router.get(
  '/users/user/tweets',
  isAuth,
  validate([{ schema: SortStringValidator, target: 'query' }]),
  paginate,
  getUserFeed,
);

router.get('/users/user/:userId', getUser);

export default router;
