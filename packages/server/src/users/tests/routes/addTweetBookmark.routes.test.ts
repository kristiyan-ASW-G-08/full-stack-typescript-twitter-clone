import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from '@users/User';
import Tweet from '@tweets/Tweet';
import UserType from '@customTypes/User';
import TweetType from '@customTypes/Tweet';
import connectToDB from '@utilities/connectToDB';

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('@utilities/sendEmail');

describe('userRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  let testUser: UserType;
  let tweet: TweetType;
  let tweetId: mongoose.Types.ObjectId;
  let userId: string;
  let token: string;
  const secret = process.env.SECRET;
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
    tweet = new Tweet({
      type: 'text',
      text: 'sadasdasdads',
      user: userId,
    });
    await tweet.save();
    tweetId = tweet._id;
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
    await Tweet.deleteMany({}).exec();
  });
  afterEach(async () => {
    await User.deleteMany({}).exec();
    await Tweet.deleteMany({}).exec();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  describe('patch /users/tweets/:tweetId/bookmark', () => {
    it('should add a tweet bookmark', async () => {
      expect.assertions(3);

      const response = await request(app)
        .patch(`/users/tweets/${tweetId}/bookmark`)
        .set('Authorization', `Bearer ${token}`);
      const user = await User.findById(userId);
      if (!user) return;
      expect(response.status).toBe(200);
      expect(user.bookmarks.length).toBe(1);
      expect(user.bookmarks[0].equals(tweetId)).toBeTruthy();
    });
    it('should remove a tweet bookmark', async () => {
      expect.assertions(3);

      testUser.bookmarks = [tweetId];
      await testUser.save();
      const response = await request(app)
        .patch(`/users/tweets/${tweetId}/bookmark`)
        .set('Authorization', `Bearer ${token}`);
      const user = await User.findById(userId);
      if (!user) return;
      expect(response.status).toBe(200);
      expect(user.bookmarks.length).toBe(0);
      expect(user.bookmarks[0]).toBeUndefined();
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).patch(
        `/users/tweets/${tweetId}/bookmark`,
      );
      expect(response.status).toBe(401);
    });
    it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const notFoundToken = jwt.sign(
        {
          userId: mongoose.Types.ObjectId().toString(),
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/tweets/${tweetId}/bookmark`)
        .set('Authorization', `Bearer ${notFoundToken}`);
      expect(response.status).toBe(404);
    });
  });
});
