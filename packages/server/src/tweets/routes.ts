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
import validationHandler from '../middleware/validationHandler';
import authenticationHandler from '../middleware/authenticationHandler';
import paginationHandler from '../middleware/paginationHandler';
import fileFilter from '../middleware/fileFilter';
import storage from '../middleware/fileStorage';

const multerStorage = multer({ storage, fileFilter }).single('image');
const router = express.Router();

router.post(
  '/tweets',
  authenticationHandler,
  multerStorage,
  validationHandler([{ schema: TweetValidator, target: 'body' }]),
  postTweet,
);

router.patch(
  '/tweets/:tweetId',
  authenticationHandler,
  multerStorage,
  validationHandler([{ schema: TweetValidator, target: 'body' }]),
  patchTweet,
);

router.delete('/tweets/:tweetId', authenticationHandler, deleteTweet);

router.get('/tweets/:tweetId', getTweet);

router.get(
  '/tweets',
  validationHandler([{ schema: SortStringValidator, target: 'query' }]),
  paginationHandler,
  getAllTweets,
);

router.get(
  '/users/:userId/tweets',
  validationHandler([{ schema: SortStringValidator, target: 'query' }]),
  paginationHandler,
  getUserTweets,
);

router.get(
  '/tweets/:tweetId/replies',
  validationHandler([{ schema: SortStringValidator, target: 'query' }]),
  paginationHandler,
  getReplies,
);

router.get(
  '/users/:userId/replies',
  validationHandler([{ schema: SortStringValidator, target: 'query' }]),
  paginationHandler,
  getUserReplies,
);

export default router;
