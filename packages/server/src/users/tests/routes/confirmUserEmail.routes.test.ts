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
  describe('patch /users/user/:token/confirm', () => {
    it("should confirm user's email address", async () => {
      expect.assertions(2);
      const userId = testUser._id;

      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );

      const response = await request(app).patch(`/users/user/${token}/confirm`);
      const confirmedUser = await User.findById(userId);
      if (!confirmedUser) {
        return;
      }
      expect(response.status).toBe(204);
      expect(confirmedUser.isConfirmed).toBeTruthy();
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
      const response = await request(app).patch(`/users/user/${token}/confirm`);
      expect(response.status).toBe(404);
    });
  });
});
