import express from 'express';
import validate from '@customMiddleware/validate';
import validateQuery from '@customMiddleware/validateQuery';
import {
  postTweet,
  deleteTweet,
  updateTweet,
  getTweet,
  getAllTweets,
} from '@controllers/tweetController';
import TweetValidator from '@twtr/common/source/schemaValidators/TweetValidator';
import GetTweetsQueryValidator from '@twtr/common/source/schemaValidators/GetTweetsQueryValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/tweets', isAuth, validate(TweetValidator), postTweet);

router.patch('/tweets/:tweetId', isAuth, validate(TweetValidator), updateTweet);

router.delete('/tweets/:tweetId', isAuth, deleteTweet);

router.get('/tweets/:tweetId', getTweet);

router.get('/tweets', validateQuery(GetTweetsQueryValidator), getAllTweets);
export default router;
