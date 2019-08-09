import express from 'express';
import validate from '@customMiddleware/validate';
import { postTweet, deleteTweet } from '@controllers/tweetController';
import TweetValidator from '@twtr/common/schemaValidators/TweetValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/tweets', isAuth, validate(TweetValidator), postTweet);

router.delete('/tweets/:tweetId', isAuth, deleteTweet);
export default router;
