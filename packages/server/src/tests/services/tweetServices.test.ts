import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import createTweet from '@services/tweetServices';
import User from '@models/User';
import Tweet from '@models/Tweet';
import db from 'src/db';
import { CustomError, errors } from '@utilities/CustomError';

jest.mock('@utilities/sendEmail');
jest.mock('jsonwebtoken');

const mockToken = 'mockToken';
(jwt.sign as jest.Mock).mockReturnValue(mockToken);

describe('tweetServices', (): void => {
  beforeAll(
    async (): Promise<void> => {
      db();
      await Tweet.deleteMany({}).exec();
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Tweet.deleteMany({}).exec();
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
  describe('createTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(3);
      const hashMock = jest.spyOn(bcrypt, 'hash');
      const { tweetId } = await createTweet(text, userId);
      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.user.toString()).toMatch(userId);
      hashMock.mockRestore();
    });
  });
  it('should throw an error', async (): Promise<void> => {
    expect.assertions(1);
    const invalidUserId = 'invalid';
    await expect(createTweet(text, invalidUserId)).rejects.toThrow();
  });
});
