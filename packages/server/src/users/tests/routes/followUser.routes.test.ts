import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from '@users/User';
import UserType from '@customTypes/User';
import connectToDB from '@utilities/connectToDB';

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
  let testUser: UserType;
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
  describe('patch /users/:userId/', () => {
    it('should follow a user', async () => {
      expect.assertions(4);
      const newAuthenticatedUser = new User({
        username: 'authenticatedUser',
        handle: 'authenticatedUserHandle',
        email: 'authenticatedUser@mail.com',
        password,
      });
      await newAuthenticatedUser.save();
      const authenticatedUserId = newAuthenticatedUser._id;
      const userId = testUser._id;
      const token = jwt.sign(
        {
          userId: authenticatedUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      const authenticatedUser = await User.findById(authenticatedUserId);
      const user = await User.findById(userId);
      if (!authenticatedUser || !user) return;
      expect(response.status).toBe(200);
      expect(authenticatedUser.following.length).toBe(1);
      expect(authenticatedUser.following[0].equals(userId)).toBeTruthy();
      expect(user.followers).toBe(1);
    });
    it('should remove a followed user', async () => {
      expect.assertions(4);
      const newAuthenticatedUser = new User({
        username: 'authenticatedUser',
        handle: 'authenticatedUserHandle',
        email: 'authenticatedUser@mail.com',
        password,
      });
      await newAuthenticatedUser.save();
      const authenticatedUserId = newAuthenticatedUser._id;
      testUser.followers = 1;
      const userId = testUser._id;
      newAuthenticatedUser.following = [userId];
      await newAuthenticatedUser.save();
      await testUser.save();
      const token = jwt.sign(
        {
          userId: authenticatedUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      const authenticatedUser = await User.findById(authenticatedUserId);
      const user = await User.findById(userId);
      if (!authenticatedUser || !user) return;
      expect(response.status).toBe(200);
      expect(authenticatedUser.following.length).toBe(0);
      expect(authenticatedUser.following[0]).toBeUndefined();
      expect(user.followers).toBe(0);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId();
      const response = await request(app).patch(`/users/${userId}`);
      expect(response.status).toBe(401);
    });
    it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const authenticatedUserId = mongoose.Types.ObjectId().toString();
      const userId = mongoose.Types.ObjectId();
      const token = jwt.sign(
        {
          userId: authenticatedUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(404);
    });
  });
});
