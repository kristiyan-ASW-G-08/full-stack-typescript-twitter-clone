import express from 'express';
import validate from '@customMiddleware/validate';
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
} from '@controllers/userController';
import UserSignUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import UserProfileValidator from '@twtr/common/source/schemaValidators/UserProfileValidator';
import ResetPasswordValidator from '@twtr/common/source/schemaValidators/ResetPasswordValidator';
import EmailValidator from '@twtr/common/source/schemaValidators/EmailValidator';
import isAuth from '@customMiddleware/isAuth';

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
  '/users/user/profile',
  isAuth,
  validate([{ schema: UserProfileValidator, target: 'body' }]),
  patchProfile,
);

router.patch('/users/tweets/:tweetId/bookmark', isAuth, bookmarkTweet);

router.patch('/users/tweets/:tweetId/like', isAuth, likeTweet);

router.patch('/users/:userId', isAuth, followUser);

router.delete('/users', isAuth, deleteUser);

router.get('/users/user/bookmarks', isAuth, getUserBookmarks);

router.get('/users/:userId/likes', getUserLikes);

router.get('/users/:searchQuery', getUsersList);

router.get('/users/user/tweets', isAuth, getUserFeed);

export default router;
