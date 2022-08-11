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
  describe('delete /users', () => {
    it('should delete a user', async () => {
      expect.assertions(1);

      const response = await request(app)
        .delete(`/users`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(204);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).delete(`/users`);
      expect(response.status).toBe(401);
    });
    it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);

      const notFoundToken = jwt.sign(
        {
          userId: mongoose.Types.ObjectId(),
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(`/users`)
        .set('Authorization', `Bearer ${notFoundToken}`);
      expect(response.status).toBe(404);
    });
  });
});
