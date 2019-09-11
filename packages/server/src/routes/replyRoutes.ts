// import express from 'express';
// import validate from '@customMiddleware/validate';
// import {
//   postReply,
//   updateReply,
//   deleteReply,
//   getReplies,
//   getUserReplies,
// } from '@controllers/replyController';
// import ReplyValidator from '@twtr/common/source/schemaValidators/ReplyValidator';
// import SortStringValidator from '@twtr/common/source/schemaValidators/SortStringValidator';
// import isAuth from '@customMiddleware/isAuth';

// const router = express.Router();
// router.post(
//   '/tweets/:tweetId/replies',
//   isAuth,
//   validate([{ schema: ReplyValidator, target: 'body' }]),
//   postReply,
// );

// router.patch(
//   '/replies/:replyId',
//   isAuth,
//   validate([{ schema: ReplyValidator, target: 'body' }]),
//   updateReply,
// );

// router.delete('/replies/:replyId', isAuth, deleteReply);

// router.get(
//   '/tweets/:tweetId/replies',
//   validate([{ schema: SortStringValidator, target: 'query' }]),
//   getReplies,
// );

// router.get(
//   '/users/:userId/replies',
//   validate([{ schema: SortStringValidator, target: 'query' }]),
//   getUserReplies,
// );
// export default router;
export default '';
