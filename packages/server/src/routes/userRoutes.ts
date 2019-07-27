import express from 'express';
import validate from '@customMiddleware/validate';
import { signUp, logIn } from '@controllers/userController';
import UserValidator from '@twtr/common/schemaValidators/UserValidator';
import UserLoginValidator from '@twtr/common/schemaValidators/UserLoginValidator';

const router = express.Router();

router.post('/users', validate(UserValidator), signUp);

router.post('/users/tokens', validate(UserLoginValidator), logIn);
export default router;
