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
  it('should throw an error when the object passed to the model does not pass validation', (): void => {
    const tweet = new Tweet();
    expect(tweet.validate).toThrow();
  });
  it('should create a new tweet when validation is successful', async (): Promise<
    void
  > => {
    expect.assertions(3);
    const user = mongoose.Types.ObjectId().toString();
    const type = 'text';
    const tweet: TweetType = new Tweet({
      user,
      type,
    });
    const saveSpy = jest.spyOn(tweet, 'save');
    await tweet.save();

    expect(saveSpy).toHaveBeenCalled();
    expect(tweet.user.toString()).toMatch(user.toString());
    expect(tweet.type).toMatch(type);
    saveSpy.mockRestore();
  });
});
