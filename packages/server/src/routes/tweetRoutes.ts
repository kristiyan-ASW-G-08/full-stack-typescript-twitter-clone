import express from 'express';
import validate from '@customMiddleware/validate';
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

router.post(
  '/tweets',
  isAuth,
  validate([{ schema: TweetValidator, target: 'body' }]),
  postTweet,
);

router.patch(
  '/tweets/:tweetId',
  isAuth,
  validate([{ schema: TweetValidator, target: 'body' }]),
  updateTweet,
);

router.delete('/tweets/:tweetId', isAuth, deleteTweet);

router.get('/tweets/:tweetId', getTweet);

router.get(
  '/tweets',
  validate([{ schema: SortStringValidator, target: 'query' }]),
  getAllTweets,
);

router.get(
  '/users/:userId/tweets',
  validate([{ schema: SortStringValidator, target: 'query' }]),
  getUserTweets,
);
export default router;
