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
  getUserBookmarks,
  patchProfile,
  getUsersList,
} from '@controllers/userController';
import UserSIgnUpValidator from '@twtr/common/source/schemaValidators/UserSignUpValidator';
import UserLoginValidator from '@twtr/common/source/schemaValidators/UserLoginValidator';
import UserProfileValidator from '@twtr/common/source/schemaValidators/UserProfileValidator';
import ResetPasswordValidator from '@twtr/common/source/schemaValidators/ResetPasswordValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/users', validate(UserSIgnUpValidator), signUp);

router.post('/users/tokens', validate(UserLoginValidator), logIn);

router.post('/users/:email', requestPasswordResetEmail);

router.patch('/users', isAuth, confirmEmail);

router.patch(
  '/users/reset',
  isAuth,
  validate(ResetPasswordValidator),
  resetPassword,
);
router.patch(
  '/users/user/profile',
  isAuth,
  validate(UserProfileValidator),
  patchProfile,
);

router.patch('/users/tweets/:tweetId', isAuth, bookmarkTweet);

router.patch('/users/tweets/:tweetId/like', isAuth, likeTweet);

router.patch('/users/:userId', isAuth, followUser);

router.delete('/users', isAuth, deleteUser);

router.get('/users/user/bookmarks', isAuth, getUserBookmarks);

router.get('/users/:searchTerm', getUsersList);
export default router;
