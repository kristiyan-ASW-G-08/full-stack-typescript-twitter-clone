import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import Tweet from 'src/tweets/Tweet';
import connectToDB from 'utilities/connectToDB';
import sendEmail from 'utilities/sendEmail';
import UserType from 'customTypes/User';
import uploadToCloudinary from 'utilities/uploadToCloudinary';
import deleteFromCloudinary from 'utilities/deleteFromCloudinary';

jest.mock('utilities/uploadToCloudinary');

jest.mock('utilities/deleteFromCloudinary');

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('utilities/sendEmail');

describe('userRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  beforeAll(async () => {
    await mongoose.disconnect();
    await connectToDB(mongoURI);
    app.listen(port);
    await Tweet.deleteMany({}).exec();
    await User.deleteMany({}).exec();
  });
  afterEach(async () => {
    await Tweet.deleteMany({}).exec();
    await User.deleteMany({}).exec();
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmailmail.com';
  const password = 'testPassword';
  const invalidEmail = 'testmail';
  const invalidPassword = '1234';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const secret = process.env.SECRET;
  describe('', () => {
    let testUser: UserType;
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
    afterEach(async () => {
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

    describe('get /users/:userId/following ', () => {
      it('should get a list of users', async () => {
        expect.assertions(3);
        const followedUser = new User({
          username: 'followedUser',
          handle: 'followedUserHandle',
          email: 'followedUserMailmail.com',
          password,
        });
        await followedUser.save();
        const followedUserId = followedUser._id.toString();
        testUser.following = [followedUserId];
        await testUser.save();
        const userId = testUser._id;
        const response = await request(app).get(`/users/${userId}/following`);
        const { users } = response.body.data;
        expect(response.status).toBe(200);
        expect(users).toHaveLength(1);
        expect(users[0]._id).toMatch(followedUserId);
      });

      it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
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
        const response = await request(app).get(`/users/${userId}/following`);
        expect(response.status).toBe(404);
      });
    });

    describe('get /users/:userId/followers ', () => {
      it('should get a list of users', async () => {
        // expect.assertions(3);
        const followedUser = new User({
          username: 'followedUser',
          handle: 'followedUserHandle',
          email: 'followedUserMailmail.com',
          password,
        });
        await followedUser.save();
        const followedUserId = followedUser._id.toString();
        testUser.following = [followedUserId];
        await testUser.save();
        const userId = testUser._id;
        const response = await request(app).get(
          `/users/${followedUserId}/followers`,
        );
        const { users } = response.body.data;
        expect(response.status).toBe(200);
        expect(users).toHaveLength(1);
        expect(users[0]._id).toMatch(userId.toString());
      });
    });
  });
});
