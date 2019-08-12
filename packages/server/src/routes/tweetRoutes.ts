import express from 'express';
import validate from '@customMiddleware/validate';
import {
  postTweet,
  deleteTweet,
  updateTweet,
  getTweet,
} from '@controllers/tweetController';
import TweetValidator from '@twtr/common/source/schemaValidators/TweetValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/tweets', isAuth, validate(TweetValidator), postTweet);

router.patch('/tweets/:tweetId', isAuth, validate(TweetValidator), updateTweet);

router.delete('/tweets/:tweetId', isAuth, deleteTweet);

router.get('/tweets/:tweetId', getTweet);
export default router;
