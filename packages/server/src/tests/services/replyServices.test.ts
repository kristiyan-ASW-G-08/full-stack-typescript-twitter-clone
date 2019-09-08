import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { getReplyById } from '@services/replyServices';
import User from '@models/User';
import Reply from '@models/Reply';
import db from 'src/db';

jest.mock('@utilities/sendEmail');
jest.mock('jsonwebtoken');

const mockToken = 'mockToken';
(jwt.sign as jest.Mock).mockReturnValue(mockToken);

describe('replyServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      db();
      await Reply.deleteMany({}).exec();
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Reply.deleteMany({}).exec();
      await User.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const userId = mongoose.Types.ObjectId().toString();
  const tweetId = mongoose.Types.ObjectId().toString();
  describe('getReplyById', (): void => {
    it(`should get a tweet`, async (): Promise<void> => {
      expect.assertions(3);
      const newReply = new Reply({
        text,
        user: userId,
        tweet: tweetId,
      });
      await newReply.save();
      const replyId = newReply._id;
      const { reply } = await getReplyById(replyId);
      if (!reply) {
        return;
      }
      expect(reply.text).toMatch(text);
      expect(reply.user.toString()).toMatch(userId);
      expect(reply.tweet.toString()).toMatch(tweetId);
    });

    it('should throw an error when the reply is not found', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const replyId = mongoose.Types.ObjectId().toString();
      await expect(getReplyById(replyId)).rejects.toThrow();
      await expect(getReplyById(replyId)).rejects.toMatchSnapshot();
    });
  });
});
