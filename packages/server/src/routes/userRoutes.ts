import express from 'express';
import validate from '@customMiddleware/validate';
import signUp from '@controllers/userController';
import UserValidator from '@twtr/common/schemaValidators/UserValidator';

const router = express.Router();

router.post('/users', validate(UserValidator), signUp);

export default router;
