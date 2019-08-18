import express from 'express';
import validate from '@customMiddleware/validate';
import {
  signUp,
  logIn,
  confirmEmail,
  requestPasswordResetEmail,
  resetPassword,
  deleteUser,
  bookmarkTweet,
  likeTweet,
  followUser,
} from '@controllers/userController';
import UserValidator from '@twtr/common/source/schemaValidators/UserValidator';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import ResetPasswordValidator from '@twtr/common/source/schemaValidators/ResetPasswordValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/users', validate(UserValidator), signUp);

router.post('/users/tokens', validate(UserLoginValidator), logIn);

router.post('/users/:email', requestPasswordResetEmail);

router.patch('/users', isAuth, confirmEmail);

router.patch(
  '/users/reset',
  isAuth,
  validate(ResetPasswordValidator),
  resetPassword,
);

router.patch('/users/tweets/:tweetId', isAuth, bookmarkTweet);

router.patch('/users/tweets/:tweetId/like', isAuth, likeTweet);

router.patch('/users/:userId', isAuth, followUser);

router.delete('/users', isAuth, deleteUser);

export default router;
