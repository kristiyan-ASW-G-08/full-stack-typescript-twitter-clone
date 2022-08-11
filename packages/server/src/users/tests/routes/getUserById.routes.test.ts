import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from 'users/User';
import UserType from 'customTypes/User';
import connectToDB from 'utilities/connectToDB';
import Tweet from 'src/tweets/Tweet';
import TweetType from 'customTypes/Tweet';

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('utilities/sendEmail');

describe('userRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmailmail.com';
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
  describe('get /users/user/:userId', () => {
    it('should get a user  based on id', async () => {
      expect.assertions(2);
      const response = await request(app).get(`/users/user/${userId}`);
      const { user } = response.body.data;
      expect(response.status).toBe(200);
      expect(user._id.toString()).toMatch(userId.toString());
    });
  });
});
