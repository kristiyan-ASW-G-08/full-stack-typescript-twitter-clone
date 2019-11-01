import express from 'express';
import {
  postTweet,
  deleteTweet,
  updateTweet,
  getTweet,
  getAllTweets,
  getReplies,
  getUserReplies,
  getUserTweets,
} from 'src/tweets/controller';
import TweetValidator from '@twtr/common/source/schemaValidators/TweetValidator';
import SortStringValidator from '@twtr/common/source/schemaValidators/SortStringValidator';
import validate from '@customMiddleware/validate';
import isAuth from '@customMiddleware/isAuth';
import paginate from '@customMiddleware/paginate';

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
  paginate,
  getAllTweets,
);

router.get(
  '/users/:userId/tweets',
  validate([{ schema: SortStringValidator, target: 'query' }]),
  paginate,
  getUserTweets,
);

router.get(
  '/tweets/:tweetId/replies',
  validate([{ schema: SortStringValidator, target: 'query' }]),
  paginate,
  getReplies,
);

router.get(
  '/users/:userId/replies',
  validate([{ schema: SortStringValidator, target: 'query' }]),
  paginate,
  getUserReplies,
);

export default router;
