import mongoose from 'mongoose';
import Tweet from '@models/Tweet';
import User from '@models/User';
import TweetType from '@customTypes/Tweet';
import db from 'src/db';

describe('Tweet model', (): void => {
  beforeAll(
    async (): Promise<void> => {
      db();
      await User.deleteMany({}).exec();
      await Tweet.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Tweet.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  it('Should throw and error', (): void => {
    const tweet = new Tweet();
    expect(tweet.validate).toThrow();
  });
  it('should create a new tweet', async (): Promise<void> => {
    expect.assertions(4);
    const user = mongoose.Types.ObjectId();
    const type = 'text';
    const tweet: TweetType = new Tweet({
      user,
      type,
    });
    const saveSpy = jest.spyOn(tweet, 'save');
    await tweet.save();

    expect(saveSpy).toHaveBeenCalled();
    expect(tweet).toMatchObject({
      user,
      type,
    });
    expect(tweet.user.toString()).toMatch(user.toString());
    expect(tweet.type).toMatch(type);
    saveSpy.mockRestore();
  });
});
