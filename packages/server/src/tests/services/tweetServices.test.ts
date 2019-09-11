import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { getTweetById } from '@services/tweetServices';
import User from '@models/User';
import Tweet from '@models/Tweet';
import db from 'src/db';

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
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  describe('getTweetById', (): void => {
    it(`should get a tweet`, async (): Promise<void> => {
      expect.assertions(2);
      const type = 'text';
      const user = new User({
        username,
        handle,
        email,
        password,
      });
      const userId = user._id;
      const newTweet = new Tweet({
        text,
        user: userId,
        type,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const tweet = await getTweetById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.type).toMatch(type);
    });

    it('should throw an error when the tweet is not found', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const tweetId = mongoose.Types.ObjectId().toString();
      await expect(getTweetById(tweetId)).rejects.toThrow();
      await expect(getTweetById(tweetId)).rejects.toMatchSnapshot();
    });
  });
});
