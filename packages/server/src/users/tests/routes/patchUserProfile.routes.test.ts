import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from 'users/User';
import UserType from 'customTypes/User';
import connectToDB from 'utilities/connectToDB';

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
  describe('patch /users/user/profile', () => {
    const newUsername = 'newTestUsername';
    const newHandle = 'newTestHandle';
    it("should patch user's username, handle", async (): Promise<void> => {
      expect.assertions(3);
      const userId = testUser._id;

      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );

      const response = await request(app)
        .patch(`/users/user/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: newUsername,
          handle: newHandle,
        });
      const user = await User.findById(userId);
      if (!user) {
        return;
      }
      expect(response.status).toBe(200);
      expect(user.username).toMatch(newUsername);
      expect(user.handle).toMatch(newHandle);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(1);

      const userId = testUser._id;

      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );

      const response = await request(app)
        .patch(`/users/user/profile`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app)
        .patch(`/users/user/profile`)
        .send({
          username: newUsername,
          handle: newHandle,
        });
      expect(response.status).toBe(401);
    });
    it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId();

      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );

      const response = await request(app)
        .patch(`/users/user/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: newUsername,
          handle: newHandle,
        });
      expect(response.status).toBe(404);
    });

    it('should throw an error with a status of 409: Conflict when the user credentials are already taken', async (): Promise<
      void
    > => {
      const duplicateUsername = 'DupUsername';
      const duplicateHandle = 'Dup';
      const duplicateEmail = 'dupmail.test';
      //   expect.assertions(1);
      await User.insertMany({
        username: duplicateUsername,
        handle: duplicateHandle,
        email: duplicateEmail,
        password,
      });
      const userId = testUser._id;
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/user/profile`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          username: duplicateUsername,
          handle: duplicateHandle,
        });
      expect(response.status).toBe(409);
    });
  });
});
