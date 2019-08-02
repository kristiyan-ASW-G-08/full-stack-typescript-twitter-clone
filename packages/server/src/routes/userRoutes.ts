import express from 'express';
import validate from '@customMiddleware/validate';
import {
  signUp,
  logIn,
  confirmEmail,
  requestPasswordResetEmail,
  resetPassword,
  deleteUser,
} from '@controllers/userController';
import UserValidator from '@twtr/common/schemaValidators/UserValidator';
import UserLoginValidator from '@twtr/common/schemaValidators/UserLoginValidator';
import ResetPasswordValidator from '@twtr/common/schemaValidators/ResetPasswordValidator';
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

router.delete('/users', isAuth, deleteUser);

export default router;
