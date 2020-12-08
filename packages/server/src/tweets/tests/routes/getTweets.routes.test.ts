import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockFs from 'mock-fs';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import UserType from '@customTypes/User';
import connectToDB from '@utilities/connectToDB';
import Tweet from 'src/tweets/Tweet';
import uploadToCloudinary from '@utilities/uploadToCloudinary';
import deleteFromCloudinary from '@utilities/deleteFromCloudinary';

jest.mock('@utilities/uploadToCloudinary');

jest.mock('@utilities/deleteFromCloudinary');

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

describe('tweetRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const link = 'https://fakeLink.fakeLink';
  const secret = process.env.SECRET;
  const userId = mongoose.Types.ObjectId();

  afterEach(async () => {
    mockFs.restore();
    await Tweet.deleteMany({}).exec();
    await User.deleteMany({}).exec();
  });
  beforeAll(async () => {
    await mongoose.disconnect();
    await connectToDB(mongoURI);
    app.listen(port);
    await Tweet.deleteMany({}).exec();
    await User.deleteMany({}).exec();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('get /tweets/:tweetId', () => {
    it('should get a tweet', async () => {
      expect.assertions(2);

      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const response = await request(app).get(`/tweets/${tweetId}`);
      const { tweet } = response.body.data;
      expect(response.status).toBe(200);
      expect(tweet._id.toString()).toMatch(tweetId.toString());
    });
    it('should throw an error with a status of 404: NotFound when the tweet is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const response = await request(app).get(
        `/tweets/${mongoose.Types.ObjectId()}`,
      );
      expect(response.status).toBe(404);
    });
  });
  describe('get /users/:userId/tweets', () => {
    it('should get a list of tweets', async () => {
      expect.assertions(1);
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const response = await request(app).get(`/users/${userId}/tweets`);
      expect(response.status).toBe(200);
    });
  });
  describe('get /tweets', () => {
    it('should get a list of tweets', async () => {
      expect.assertions(1);
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const response = await request(app).get(`/tweets`);
      expect(response.status).toBe(200);
    });
  });
  describe('get /tweets/:tweetId/replies', () => {
    it('should get a list of replies by tweet', async () => {
      expect.assertions(1);

      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Tweet({
        text,
        type: 'reply',
        user: userId,
        reply: tweetId,
      });
      await newReply.save();
      const response = await request(app).get(`/tweets/${tweetId}/replies`);
      expect(response.status).toBe(200);
    });
  });
  describe('get /users/:userId/replies', () => {
    it('should get a list of replies by user', async () => {
      expect.assertions(1);

      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Tweet({
        text,
        type: 'reply',
        user: userId,
        reply: tweetId,
      });
      await newReply.save();
      const response = await request(app).get(`/users/${userId}/replies`);
      expect(response.status).toBe(200);
    });
  });
});
