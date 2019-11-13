import mongoose from 'mongoose';
import findDocs from '@utilities/findDocs';
import User from '@users/User';
import Tweet from '@tweets/Tweet';
import TweetType from '@customTypes/Tweet';
import UserType from '@customTypes/User';
import db from 'src/db';

describe('getTweetById', (): void => {
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  let user: UserType;
  beforeEach(
    async (): Promise<void> => {
      user = new User({ username, handle, email, password });
      await user.save();
    },
  );
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
  it(`should find a tweet by user id`, async (): Promise<void> => {
    expect.assertions(2);
    const userId2 = mongoose.Types.ObjectId();
    const text = 'ThisTweet';
    await Tweet.insertMany([{ text, user: user._id, type: 'text' }]);
    await Tweet.insertMany([{ text: 'text', user: userId2, type: 'text' }]);

    const { documents } = await findDocs<TweetType>(Tweet, 1, 25, '-date', {
      user: user._id,
    });

    expect(documents).toHaveLength(1);
    expect(documents[0].text).toMatch(text);
  });
});
