import express from 'express';
import validate from 'src/middleware/validate';
import signUp from 'src/controllers/userController';
import UserValidator from '@twtr/common/schemaValidators/UserValidator';

const router = express.Router();

router.post('/users', validate(UserValidator), signUp);

export default router;
