import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import Tweet from 'src/tweets/Tweet';
import connectToDB from '@utilities/connectToDB';
import sendEmail from '@utilities/sendEmail';
import UserType from '@customTypes/User';
import uploadToCloudinary from '@utilities/uploadToCloudinary';
import deleteFromCloudinary from '@utilities/deleteFromCloudinary';

jest.mock('@utilities/uploadToCloudinary');

jest.mock('@utilities/deleteFromCloudinary');

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('@utilities/sendEmail');

describe('userRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
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
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const invalidEmail = 'testmail';
  const invalidPassword = '1234';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const secret = process.env.SECRET;
  describe('/users', () => {
    it('should create a new user', async () => {
      expect.assertions(2);
      const response = await request(app)
        .post('/users')
        .send({
          username,
          handle,
          email,
          password,
          confirmPassword: password,
        });
      expect(response.status).toBe(201);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(3);
      const response = await request(app)
        .post('/users')
        .send({
          username,
          handle,
          email: invalidEmail,
          password: invalidPassword,
          confirmPassword: password,
        });
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
      expect(sendEmail).not.toHaveBeenCalled();
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(3);
      const response = await request(app).post('/users');
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
      expect(sendEmail).not.toHaveBeenCalled();
    });
    it('should throw an error with a status of 409: Conflict when the user credentials are already taken', async (): Promise<
      void
    > => {
      expect.assertions(2);
      await User.insertMany({ username, handle, email, password });
      const response = await request(app)
        .post('/users')
        .send({
          username,
          handle,
          email,
          password,
          confirmPassword: password,
        });
      expect(response.status).toBe(409);
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
  describe.only('post /users/user/tokens', () => {
    it('should get a authentication token and user data object', async (): Promise<
      void
    > => {
      // expect.assertions(5);
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.insertMany({
        username,
        handle,
        email,
        password: hashedPassword,
        isConfirmed: true,
      });
      const response = await request(app)
        .post('/users/user/tokens')
        .send({
          email,
          password,
        });
      const { token, user } = response.body.data;
      expect(response.status).toBe(200);
      expect(typeof token).toMatch('string');
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(2);
      const response = await request(app).post('/users/user/tokens');
      expect(response.status).toBe(400);
      expect(response.body).toMatchSnapshot();
    });
    it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app)
        .post('/users/user/tokens')
        .send({
          email,
          password,
        });
      expect(response.status).toBe(404);
    });
  });

  describe('get /users/:searchQuery', () => {
    it('should get a list of users based on search term', async (): Promise<
      void
    > => {
      expect.assertions(2);
      await User.insertMany([
        {
          username,
          handle,
          email,
          password,
        },
        {
          username: 'otherUsername',
          handle: 'testHandle',
          email: 'otherTestmail@mail.com',
          password,
        },
        {
          username: 'newOtherUsername',
          handle: 'userHandle',
          email: 'newTestmail@mail.com',
          password,
        },
      ]);
      const searchTerm = 'userHandle';
      const response = await request(app).get(`/users/${searchTerm}`);
      const { users } = response.body.data;
      expect(response.status).toBe(200);
      expect(users).toHaveLength(2);
    });
  });

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

        const response = await request(app).patch(
          `/users/user/${token}/confirm`,
        );
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
        const response = await request(app).patch(
          `/users/user/${token}/confirm`,
        );
        expect(response.status).toBe(404);
      });
    });

    describe('post /users/user', () => {
      it('should request password reset email', async () => {
        expect.assertions(1);
        const response = await request(app)
          .post(`/users/user`)
          .send({ email });
        expect(response.status).toBe(204);
      });
      it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
        void
      > => {
        expect.assertions(1);
        const response = await request(app)
          .post(`/users/user`)
          .send({ email: 'unknownEmail@mail.test' });
        expect(response.status).toBe(404);
      });
    });
    describe('patch /users/user/reset', () => {
      it("should reset user's password", async () => {
        expect.assertions(1);
        const userId = testUser._id;
        const newPassword = 'newPasswordNewPassword';
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/user/reset`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: newPassword,
            confirmPassword: newPassword,
          });
        expect(response.status).toBe(204);
      });
      it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
        void
      > => {
        expect.assertions(1);
        const userId = testUser._id;
        const newPassword = 'invalid';
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/user/reset`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: newPassword,
            confirmPassword: newPassword,
          });
        expect(response.status).toBe(400);
      });
      it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
        void
      > => {
        expect.assertions(1);
        const userId = mongoose.Types.ObjectId();
        const newPassword = 'newPasswordNewPassword';
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/user/reset`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            password: newPassword,
            confirmPassword: newPassword,
          });
        expect(response.status).toBe(404);
      });
    });

    describe('patch /users/user/profile', () => {
      const newUsername = 'newTestUsername';
      const newHandle = 'newTestHandle';
      const website = 'https://sometestwebsite.test';
      it("should patch user's username, handle and website", async (): Promise<
        void
      > => {
        expect.assertions(4);
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
            website,
          });
        const user = await User.findById(userId);
        if (!user) {
          return;
        }
        expect(response.status).toBe(200);
        expect(user.username).toMatch(newUsername);
        expect(user.handle).toMatch(newHandle);
        expect(user.website).toMatch(website);
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
            website,
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
            website,
          });
        expect(response.status).toBe(404);
      });

      it('should throw an error with a status of 409: Conflict when the user credentials are already taken', async (): Promise<
        void
      > => {
        const duplicateUsername = 'DupUsername';
        const duplicateHandle = 'Dup';
        const duplicateEmail = 'dup@mail.test';
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
            website,
          });
        expect(response.status).toBe(409);
      });
    });

    describe('patch /users/tweets/:tweetId/bookmark', () => {
      it('should add a tweet bookmark', async () => {
        expect.assertions(3);
        const userId = testUser._id;
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: userId,
        });
        await newTweet.save();
        const tweetId = newTweet._id;
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
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
        const userId = testUser._id;
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: userId,
        });
        await newTweet.save();
        const tweetId = newTweet._id;
        testUser.bookmarks = [tweetId];
        await testUser.save();
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
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
        const tweetId = mongoose.Types.ObjectId();
        const response = await request(app).patch(
          `/users/tweets/${tweetId}/bookmark`,
        );
        expect(response.status).toBe(401);
      });
      it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
        void
      > => {
        expect.assertions(1);
        const userId = mongoose.Types.ObjectId().toString();
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: userId,
        });
        await newTweet.save();
        const tweetId = newTweet._id;
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/tweets/${tweetId}/bookmark`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
    });

    describe('patch /users/tweets/:tweetId/like', () => {
      it('should add a liked tweet', async () => {
        expect.assertions(4);
        const userId = testUser._id;
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: userId,
        });
        await newTweet.save();
        const tweetId = newTweet._id;
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/tweets/${tweetId}/like`)
          .set('Authorization', `Bearer ${token}`);
        const user = await User.findById(userId);
        const tweet = await Tweet.findById(tweetId);
        if (!user || !tweet) return;
        expect(response.status).toBe(200);
        expect(user.likes.length).toBe(1);
        expect(user.likes[0].equals(tweetId)).toBeTruthy();
        expect(tweet.likes).toBe(1);
      });
      it('should remove a liked tweet', async () => {
        expect.assertions(4);
        const userId = testUser._id;
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: userId,
          likes: 1,
        });
        await newTweet.save();
        const tweetId = newTweet._id;
        testUser.likes = [tweetId];
        await testUser.save();
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/tweets/${tweetId}/like`)
          .set('Authorization', `Bearer ${token}`);
        const user = await User.findById(userId);
        const tweet = await Tweet.findById(tweetId);
        if (!user || !tweet) return;
        expect(response.status).toBe(200);
        expect(user.likes.length).toBe(0);
        expect(user.likes[0]).toBeUndefined();
        expect(tweet.likes).toBe(0);
      });
      it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
        void
      > => {
        expect.assertions(1);
        const tweetId = mongoose.Types.ObjectId();
        const response = await request(app).patch(
          `/users/tweets/${tweetId}/like`,
        );
        expect(response.status).toBe(401);
      });
      it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
        void
      > => {
        expect.assertions(1);
        const userId = mongoose.Types.ObjectId().toString();
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: userId,
        });
        await newTweet.save();
        const tweetId = newTweet._id;
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .patch(`/users/tweets/${tweetId}/like`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
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

    describe('get /users/user/bookmarks', () => {
      it('should get a list of bookmarks', async () => {
        expect.assertions(1);
        const validUserId = mongoose.Types.ObjectId().toString();
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: validUserId,
        });
        await newTweet.save();
        testUser.bookmarks = [newTweet._id];
        await testUser.save();
        const userId = testUser._id;
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .get(`/users/user/bookmarks`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
      });
      it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
        void
      > => {
        expect.assertions(1);
        const response = await request(app).get(`/users/user/bookmarks`);
        expect(response.status).toBe(401);
      });
    });

    describe('get /users/:userId/likes', () => {
      it('should get a list of liked tweets or replies', async (): Promise<
        void
      > => {
        expect.assertions(1);
        const validUserId = mongoose.Types.ObjectId().toString();
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: validUserId,
        });
        await newTweet.save();
        testUser.likes = [newTweet._id];
        await testUser.save();
        const userId = testUser._id;
        const response = await request(app).get(`/users/${userId}/likes`);
        expect(response.status).toBe(200);
      });
      it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
        void
      > => {
        expect.assertions(1);
        const userId = mongoose.Types.ObjectId();
        const response = await request(app).get(`/users/${userId}/likes`);
        expect(response.status).toBe(404);
      });
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
          text,
          user: followedUserId,
        });
        await newTweet.save();
        testUser.following = [followedUserId];
        await testUser.save();
        const userId = testUser._id;
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
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
          text,
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
        const newTweet = new Tweet({
          type: 'text',
          text,
          user: followedUserId,
        });
        await newTweet.save();
        testUser.following = [followedUserId];
        await testUser.save();
        const token = jwt.sign(
          {
            userId: mongoose.Types.ObjectId(),
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .get(`/users/user/tweets`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
    });

    describe('get /users/user/:userId', () => {
      it('should get a user  based on id', async () => {
        expect.assertions(2);
        const userId = testUser._id;
        const response = await request(app).get(`/users/user/${userId}`);
        const { user } = response.body.data;
        expect(response.status).toBe(200);
        expect(user._id.toString()).toMatch(userId.toString());
      });
    });
    describe('get /users/:userId/following ', () => {
      it('should get a list of users', async () => {
        expect.assertions(3);
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
          email: 'followedUserMail@mail.com',
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
    describe('delete /users', () => {
      it('should delete a user', async () => {
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
        const userId = mongoose.Types.ObjectId();
        const token = jwt.sign(
          {
            userId,
          },
          secret,
          { expiresIn: '1h' },
        );
        const response = await request(app)
          .delete(`/users`)
          .set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(404);
      });
    });
  });
});
