import express from 'express';
import validate from '@customMiddleware/validate';
import { postTweet } from '@controllers/tweetController';
import TweetValidator from '@twtr/common/schemaValidators/TweetValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/tweets', isAuth, validate(TweetValidator), postTweet);

export default router;
