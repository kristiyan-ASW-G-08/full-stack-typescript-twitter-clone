import express from 'express';
import multer from 'multer';
import {
  postTweet,
  deleteTweet,
  patchTweet,
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
import fileFilter from '@customMiddleware/fileFilter';
import storage from '@customMiddleware/fileStorage';

const multerStorage = multer({ storage, fileFilter }).single('image');
const router = express.Router();

router.post(
  '/tweets',
  isAuth,
  multerStorage,
  validate([{ schema: TweetValidator, target: 'body' }]),
  postTweet,
);

router.patch(
  '/tweets/:tweetId',
  isAuth,
  multerStorage,
  validate([{ schema: TweetValidator, target: 'body' }]),
  patchTweet,
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
