import mongoose from 'mongoose';
import Tweet from 'src/tweets/Tweet';
import User from 'src/users/User';
import TweetType from '@customTypes/Tweet';
import connectToDB from '@utilities/connectToDB';

describe('Tweet model', (): void => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  beforeAll(
    async (): Promise<void> => {
      await connectToDB(mongoURI);
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
