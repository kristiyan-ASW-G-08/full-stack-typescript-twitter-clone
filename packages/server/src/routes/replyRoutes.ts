import express from 'express';
import validate from '@customMiddleware/validate';
import validateQuery from '@customMiddleware/validateQuery';
import {
  postReply,
  updateReply,
  deleteReply,
  getReplies,
  getUserReplies,
} from '@controllers/replyController';
import ReplyValidator from '@twtr/common/source/schemaValidators/ReplyValidator';
import SortStringValidator from '@twtr/common/source/schemaValidators/SortStringValidator';
import isAuth from '@customMiddleware/isAuth';

const router = express.Router();

router.post(
  '/tweets/:tweetId/replies',
  isAuth,
  validate(ReplyValidator),
  postReply,
);

router.patch(
  '/replies/:replyId',
  isAuth,
  validate(ReplyValidator),
  updateReply,
);

router.delete('/replies/:replyId', isAuth, deleteReply);

router.get(
  '/tweets/:tweetId/replies',
  validateQuery(SortStringValidator),
  getReplies,
);

router.get(
  '/users/:userId/replies',
  validateQuery(SortStringValidator),
  getUserReplies,
);
export default router;
