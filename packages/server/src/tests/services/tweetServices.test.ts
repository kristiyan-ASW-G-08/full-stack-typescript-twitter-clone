import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createTweet,
  createLinkTweet,
  createImageTweet,
  createRetweet,
  getTweetById,
} from '@services/tweetServices';
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
  const link = 'fakeUrl';
  const imagePath = 'fakeImagePath';
  const mockUserId = mongoose.Types.ObjectId().toString();
  const mockTweetId = mongoose.Types.ObjectId().toString();
  describe('createTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(3);
      const { tweetId } = await createTweet(text, mockUserId);
      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.user.toString()).toMatch(mockUserId);
    });
    it('should throw an error', async (): Promise<void> => {
      expect.assertions(1);
      const invalidUserId = 'invalid';
      await expect(createTweet(text, invalidUserId)).rejects.toThrow();
    });
  });

  describe('createImageTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(4);
      const { tweetId } = await createImageTweet(text, imagePath, mockUserId);
      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.image).toMatch(imagePath);
      expect(tweet.user.toString()).toMatch(mockUserId);
    });
    it('should throw an error when the user id is invalid', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const invalidUserId = 'invalid';
      await expect(
        createImageTweet(text, imagePath, invalidUserId),
      ).rejects.toThrow();
      await expect(
        createImageTweet(text, imagePath, invalidUserId),
      ).rejects.toMatchSnapshot();
    });
  });

  describe('createLinkTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(4);
      const { tweetId } = await createLinkTweet(text, link, mockUserId);

      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.link).toMatch(link);
      expect(tweet.user.toString()).toMatch(mockUserId);
    });
    it('should throw an error when the user id is invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const invalidUserId = 'invalid';
      await expect(
        createLinkTweet(text, imagePath, invalidUserId),
      ).rejects.toThrow();
    });
  });

  describe('createRetweet', (): void => {
    it(`should create a new retweet`, async (): Promise<void> => {
      expect.assertions(4);
      const { tweetId } = await createRetweet(text, mockTweetId, mockUserId);
      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.user.toString()).toMatch(mockUserId);
      expect(tweet.retweet.toString()).toMatch(mockTweetId);
    });
    it('should throw an error when the user id is invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const invalidUserId = 'invalid';
      await expect(
        createRetweet(text, mockUserId, invalidUserId),
      ).rejects.toThrow();
    });
    it('should throw an error when the tweet id is invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const invalidTweetId = 'invalid';
      await expect(
        createRetweet(text, invalidTweetId, mockUserId),
      ).rejects.toThrow();
    });
  });

  describe('getTweetById', (): void => {
    it(`should get a tweet`, async (): Promise<void> => {
      expect.assertions(3);
      const type = 'text';
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        text,
        user: userId,
        type,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const { tweet } = await getTweetById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.type).toMatch(type);
      expect(tweet.user.toString()).toMatch(userId.toString());
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
