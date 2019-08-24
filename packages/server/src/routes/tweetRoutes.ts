import express from 'express';
import validate from '@customMiddleware/validate';
import validateQuery from '@customMiddleware/validateQuery';
import {
  postTweet,
  deleteTweet,
  updateTweet,
  getTweet,
  getAllTweets,
  getUserTweets,
} from '@controllers/tweetController';
import TweetValidator from '@twtr/common/source/schemaValidators/TweetValidator';
import SortStringValidator from '@twtr/common/source/schemaValidators/SortStringValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post('/tweets', isAuth, validate(TweetValidator), postTweet);

router.patch('/tweets/:tweetId', isAuth, validate(TweetValidator), updateTweet);

router.delete('/tweets/:tweetId', isAuth, deleteTweet);

router.get('/tweets/:tweetId', getTweet);

router.get('/tweets', validateQuery(SortStringValidator), getAllTweets);

router.get(
  '/users/:userId/tweets',
  validateQuery(SortStringValidator),
  getUserTweets,
);
export default router;
