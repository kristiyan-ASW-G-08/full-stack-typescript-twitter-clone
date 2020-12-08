import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from '@users/User';
import UserType from '@customTypes/User';
import connectToDB from '@utilities/connectToDB';
import Tweet from '@src/tweets/Tweet';
import TweetType from '@customTypes/Tweet';

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('@utilities/sendEmail');

describe('userRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const secret = process.env.SECRET;
  let testUser: UserType;
  let testTweet: TweetType;
  let tweetId: mongoose.Types.ObjectId;
  let userId: string;
  let token: string;
  beforeEach(async () => {
    testUser = new User({
      username,
      handle,
      email,
      password,
      isConfirmed: true,
    });
    await testUser.save();
    userId = testUser._id;
    testTweet = new Tweet({
      type: 'text',
      text: 'sadasdasdads',
      user: userId,
    });
    await testTweet.save();
    token = jwt.sign(
      {
        userId,
      },
      secret,
      { expiresIn: '1h' },
    );
  });
  beforeAll(async () => {
    await mongoose.disconnect();
    await connectToDB(mongoURI);
    app.listen(port);
    await User.deleteMany({}).exec();
  });
  afterEach(async () => {
    await User.deleteMany({}).exec();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('get /users/user/tweets', () => {
    it("should get a list of tweets based on user's following", async (): Promise<
      void
    > => {
      expect.assertions(2);
      const followedUser = new User({
        username: 'followedUser',
        handle: 'followedUserHandle',
        email: 'followedUserMail@mail.com',
        password,
      });
      await followedUser.save();
      const followedUserId = followedUser._id.toString();
      const newTweet = new Tweet({
        type: 'text',
        text: "'",
        user: followedUserId,
      });
      await newTweet.save();
      testUser.following = [followedUserId];
      await testUser.save();
      const response = await request(app)
        .get(`/users/user/tweets`)
        .set('Authorization', `Bearer ${token}`);
      const { tweets } = response.body.data;
      expect(response.status).toBe(200);
      expect(tweets).toHaveLength(1);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const followedUser = new User({
        username: 'followedUser',
        handle: 'followedUserHandle',
        email: 'followedUserMail@mail.com',
        password,
      });
      await followedUser.save();
      const followedUserId = followedUser._id.toString();
      const newTweet = new Tweet({
        type: 'text',
        text: '',
        user: followedUserId,
      });
      await newTweet.save();
      testUser.following = [followedUserId];
      await testUser.save();
      const response = await request(app).get(`/users/user/tweets`);
      expect(response.status).toBe(401);
    });
    it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const followedUser = new User({
        username: 'followedUser',
        handle: 'followedUserHandle',
        email: 'followedUserMail@mail.com',
        password,
      });
      await followedUser.save();
      const followedUserId = followedUser._id.toString();

      testUser.following = [followedUserId];
      await testUser.save();
      const notFoundToken = jwt.sign(
        {
          userId: mongoose.Types.ObjectId(),
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .get(`/users/user/tweets`)
        .set('Authorization', `Bearer ${notFoundToken}`);
      expect(response.status).toBe(404);
    });
  });
});
