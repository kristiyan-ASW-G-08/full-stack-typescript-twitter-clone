import mongoose from 'mongoose';
import Tweet from 'src/tweets/Tweet';
import User from 'src/users/User';
import TweetType from 'customTypes/Tweet';
import connectToDB from 'utilities/connectToDB';

describe('Tweet model', (): void => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const user = mongoose.Types.ObjectId().toString();
  const type = 'text';
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

  it('should create a new tweet when validation is successful', async (): Promise<
    void
  > => {
    expect.assertions(6);

    const tweet: TweetType = new Tweet({
      user,
      type,
    });

    await expect(tweet.save()).resolves.not.toThrowError();

    expect(tweet.user.toString()).toMatch(user.toString());
    expect(tweet.type).toMatch(type);
    expect(tweet.likes).toBe(0);
    expect(tweet.replies).toBe(0);
    expect(tweet.retweets).toBe(0);
  });
});
