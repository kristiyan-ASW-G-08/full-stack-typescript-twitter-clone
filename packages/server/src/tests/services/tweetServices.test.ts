import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createTweet,
  createLinkTweet,
  createImageTweet,
  getTweetById,
  getTweets,
} from '@services/tweetServices';
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
  const link = 'fakeUrl';
  const imagePath = 'fakeImagePath';
  const mockUserId = mongoose.Types.ObjectId().toString();
  describe('createTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(3);
      const hashMock = jest.spyOn(bcrypt, 'hash');
      const { tweetId } = await createTweet(text, mockUserId);
      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.user.toString()).toMatch(mockUserId);
      hashMock.mockRestore();
    });
  });
  it('should throw an error', async (): Promise<void> => {
    expect.assertions(1);
    const invalidUserId = 'invalid';
    await expect(createTweet(text, invalidUserId)).rejects.toThrow();
  });
  describe('createImageTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(4);
      const hashMock = jest.spyOn(bcrypt, 'hash');
      const { tweetId } = await createImageTweet(text, imagePath, mockUserId);
      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.image).toMatch(imagePath);
      expect(tweet.user.toString()).toMatch(mockUserId);
      hashMock.mockRestore();
    });
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
  describe('createLinkTweet', (): void => {
    it(`should create a new tweet`, async (): Promise<void> => {
      expect.assertions(4);
      const hashMock = jest.spyOn(bcrypt, 'hash');
      const { tweetId } = await createLinkTweet(text, link, mockUserId);

      expect(tweetId).toBeTruthy();
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(tweet.text).toMatch(text);
      expect(tweet.link).toMatch(link);
      expect(tweet.user.toString()).toMatch(mockUserId);
      hashMock.mockRestore();
    });
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
  describe('getTweets', (): void => {
    it(`should get a list of tweets`, async (): Promise<void> => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId().toString();
      await Tweet.insertMany([
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
      ]);
      const sort = 'new';
      const limit = 5;
      const page = 1;
      const { tweets, tweetsCount } = await getTweets(sort, limit, page);
      expect(tweets.length).toBe(5);
      expect(tweetsCount).toBe(0);
    });
    it(`should get an empty list of tweets when none are found`, async (): Promise<
      void
    > => {
      expect.assertions(2);
      const sort = 'new';
      const limit = 5;
      const page = 1;
      const { tweets, tweetsCount } = await getTweets(sort, limit, page);
      expect(tweets.length).toBe(0);
      expect(tweetsCount).toBe(-5);
    });

    it('should get a list of tweets sorted by likes', async (): Promise<
      void
    > => {
      expect.assertions(5);
      const userId = mongoose.Types.ObjectId().toString();
      await Tweet.insertMany([
        {
          type: 'text',
          text,
          user: userId,
          likes: 100,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
          likes: 300,
        },
        {
          type: 'text',
          text,
          user: userId,
          likes: 200,
        },

        {
          type: 'text',
          text,
          user: userId,
        },
      ]);
      const sort = 'likes';
      const limit = 5;
      const page = 1;
      const { tweets, tweetsCount } = await getTweets(sort, limit, page);
      expect(tweets.length).toEqual(5);
      expect(tweets[0].likes).toBe(300);
      expect(tweets[1].likes).toBe(200);
      expect(tweets[2].likes).toBe(100);
      expect(tweetsCount).toBe(0);
    });
    it('should get a list of tweets sorted by comments', async (): Promise<
      void
    > => {
      expect.assertions(5);
      const userId = mongoose.Types.ObjectId().toString();
      await Tweet.insertMany([
        {
          type: 'text',
          text,
          user: userId,
          comments: 100,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
          comments: 300,
        },
        {
          type: 'text',
          text,
          user: userId,
          comments: 200,
        },

        {
          type: 'text',
          text,
          user: userId,
        },
      ]);
      const sort = 'comments';
      const limit = 5;
      const page = 1;
      const { tweets, tweetsCount } = await getTweets(sort, limit, page);
      expect(tweets.length).toEqual(5);
      expect(tweets[0].comments).toBe(300);
      expect(tweets[1].comments).toBe(200);
      expect(tweets[2].comments).toBe(100);
      expect(tweetsCount).toBe(0);
    });
    it('should get a list of tweets sorted by retweets', async (): Promise<
      void
    > => {
      expect.assertions(5);
      const userId = mongoose.Types.ObjectId().toString();
      await Tweet.insertMany([
        {
          type: 'text',
          text,
          user: userId,
          retweets: 100,
        },
        {
          type: 'text',
          text,
          user: userId,
        },
        {
          type: 'text',
          text,
          user: userId,
          retweets: 300,
        },
        {
          type: 'text',
          text,
          user: userId,
          retweets: 200,
        },

        {
          type: 'text',
          text,
          user: userId,
        },
      ]);
      const sort = 'trending';
      const limit = 5;
      const page = 1;
      const { tweets, tweetsCount } = await getTweets(sort, limit, page);
      expect(tweets.length).toEqual(5);
      expect(tweets[0].retweets).toBe(300);
      expect(tweets[1].retweets).toBe(200);
      expect(tweets[2].retweets).toBe(100);
      expect(tweetsCount).toBe(0);
    });
  });
});
