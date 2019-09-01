import { Request, Response, NextFunction } from 'express';
import Reply from '@models/Reply';
import { createReply, getReplyById } from '@services/replyServices';
import passErrorToNext from '@utilities/passErrorToNext';
import isAuthorized from '@utilities/isAuthorized';
import getSortString from '@utilities/getSortString';

export const postReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const { text } = req.body;
    const { userId } = req;
    const { replyId } = await createReply(text, userId, tweetId);

    res.status(200).json({ data: { replyId } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
export const updateReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { replyId } = req.params;
    const { userId } = req;
    const { reply } = await getReplyById(replyId);
    const { text } = req.body;
    isAuthorized(reply.user.toString(), userId);
    reply.text = text;
    await reply.save();

    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const deleteReply = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { replyId } = req.params;
    const { userId } = req;
    const { reply } = await getReplyById(replyId);
    isAuthorized(reply.user.toString(), userId);

    await reply.remove();
    res.sendStatus(204);
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getReplies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { tweetId } = req.params;
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10) || 1;
    const { SERVER_URL } = process.env;
    const sortString = getSortString(sort);
    const replies = await Reply.countDocuments()
      .find({ tweet: tweetId })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const repliesCount = (await Reply.countDocuments()) - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (repliesCount > 0) {
      links.next = `${SERVER_URL}/tweets/${tweetId}/replies?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/tweets/${tweetId}/replies?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { replies, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};

export const getUserReplies = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const sort = req.query.sort || 'top';
    const limit = parseInt(req.query.limit, 10) || 25;
    const page = parseInt(req.query.page, 10) || 1;
    const { SERVER_URL } = process.env;
    const sortString = getSortString(sort);
    const replies = await Reply.countDocuments()
      .find({ user: userId })
      .sort(sortString)
      .skip((page - 1) * limit)
      .limit(limit);
    const repliesCount = (await Reply.countDocuments()) - page * limit;
    const links: { next: null | string; prev: null | string } = {
      next: null,
      prev: null,
    };
    if (repliesCount > 0) {
      links.next = `${SERVER_URL}/users/${userId}/replies?page=${page +
        1}&limit=${limit}&sort=${sort}`;
    }
    if (page > 1) {
      links.prev = `${SERVER_URL}/users/${userId}/replies?page=${page -
        1}&limit=${limit}&sort=${sort}`;
    }
    res.status(200).json({ data: { replies, links } });
  } catch (err) {
    passErrorToNext(err, next);
  }
};
