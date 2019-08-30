import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from '@models/User';
import Tweet from '@models/Tweet';
import db from 'src/db';
import sendEmail from '@utilities/sendEmail';

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('@utilities/sendEmail');

describe('userRoutes', (): void => {
  beforeAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
      await db();
      app.listen(port);
      await Tweet.deleteMany({}).exec();
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await Tweet.deleteMany({}).exec();
      await User.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const invalidEmail = 'testmail';
  const invalidPassword = '1234';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const secret = process.env.SECRET;
  describe('/users', (): void => {
    it('should create a new user', async (): Promise<void> => {
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
      expect(response.status).toEqual(204);
      expect(sendEmail).toHaveBeenCalledTimes(1);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
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
      expect(response.status).toEqual(400);
      expect(response.body).toMatchSnapshot();
      expect(sendEmail).not.toHaveBeenCalled();
    });
    it('should throw an error with a status of 409: Conflict when the user credentials are already taken', async (): Promise<
      void
    > => {
      expect.assertions(3);
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
      expect(response.status).toEqual(409);
      expect(response.body).toMatchSnapshot();
      expect(sendEmail).not.toHaveBeenCalled();
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(3);
      const response = await request(app).post('/users');
      expect(response.status).toEqual(400);
      expect(response.body).toMatchSnapshot();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
  describe('post /users/user/tokens', (): void => {
    it('should get a authentication token and user data object', async (): Promise<
      void
    > => {
      expect.assertions(5);
      const hashedPassword = await bcrypt.hash(password, 12);
      await User.insertMany({
        username,
        handle,
        email,
        password: hashedPassword,
        confirmed: true,
      });
      const response = await request(app)
        .post('/users/user/tokens')
        .send({
          email,
          password,
        });
      const { token, user } = response.body.data;
      expect(response.status).toEqual(200);
      expect(typeof token).toMatch('string');
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
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
      expect(response.status).toEqual(404);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(2);
      const response = await request(app).post('/users/user/tokens');
      expect(response.status).toEqual(400);
      expect(response.body).toMatchSnapshot();
    });
  });
  describe('patch /users/user/verify', (): void => {
    it("should verify user's email address", async (): Promise<void> => {
      expect.assertions(2);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;

      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );

      const response = await request(app)
        .patch(`/users/user/verify`)
        .set('Authorization', `Bearer ${token}`);
      const confirmedUser = await User.findById(newUser._id);
      if (!confirmedUser) {
        return;
      }
      expect(response.status).toEqual(204);
      expect(confirmedUser.confirmed).toBeTruthy();
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
        .patch(`/users/user/verify`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).patch(`/users/user/verify`);
      expect(response.status).toEqual(401);
    });
  });
  describe('post /users/user', (): void => {
    it('should request password reset email', async (): Promise<void> => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
        confirmed: true,
      });
      await newUser.save();
      const response = await request(app)
        .post(`/users/user`)
        .send({ email });
      expect(response.status).toEqual(204);
    });
    it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app)
        .post(`/users/user`)
        .send({ email });
      expect(response.status).toEqual(404);
    });
  });
  describe('patch /users/user/reset', (): void => {
    it("should reset user's password", async (): Promise<void> => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(204);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(400);
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
      expect(response.status).toEqual(404);
    });
  });
  describe('patch /users/user/profile', (): void => {
    const newUsername = 'newTestUsername';
    const newHandle = 'newTestHandle';
    const website = 'https://sometestwebsite.test';
    const newEmail = 'someNewTest@mail.com';
    it("should patch user's username, handle and website", async (): Promise<
      void
    > => {
      expect.assertions(4);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;

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
      const user = await User.findById(newUser._id);
      if (!user) {
        return;
      }
      expect(response.status).toEqual(204);
      expect(user.username).toMatch(newUsername);
      expect(user.handle).toMatch(newHandle);
      expect(user.website).toMatch(website);
    });
    it('should throw an error with a status of 409: Conflict when the user credentials are already taken', async (): Promise<
      void
    > => {
      expect.assertions(1);
      await User.insertMany({ username, handle, email, password });

      const newUser = new User({
        username: newUsername,
        handle: newHandle,
        email: newEmail,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
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
          username,
          handle,
          website,
        });
      expect(response.status).toEqual(409);
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
      expect(response.status).toEqual(404);
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
      expect(response.status).toEqual(401);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;

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
      expect(response.status).toEqual(400);
    });
  });
  describe('patch /users/tweets/:tweetId/bookmark', (): void => {
    it('should add a tweet bookmark', async (): Promise<void> => {
      expect.assertions(3);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(200);
      expect(user.bookmarks.length).toBe(1);
      expect(user.bookmarks[0].source.equals(tweetId)).toBeTruthy();
    });
    it('should remove a tweet bookmark', async (): Promise<void> => {
      expect.assertions(3);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      newUser.bookmarks = [{ source: tweetId, ref: 'Tweet' }];
      await newUser.save();
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
      expect(response.status).toEqual(200);
      expect(user.bookmarks.length).toBe(0);
      expect(user.bookmarks[0]).toBeUndefined();
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
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const tweetId = mongoose.Types.ObjectId();
      const response = await request(app).patch(
        `/users/tweets/${tweetId}/bookmark`,
      );
      expect(response.status).toEqual(401);
    });
  });
  describe('patch /users/tweets/:tweetId/like', (): void => {
    it('should add a liked tweet', async (): Promise<void> => {
      expect.assertions(4);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(200);
      expect(user.likes.length).toBe(1);
      expect(user.likes[0].source.equals(tweetId)).toBeTruthy();
      expect(tweet.likes).toBe(1);
    });
    it('should remove a liked tweet', async (): Promise<void> => {
      expect.assertions(4);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
        likes: 1,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      newUser.likes = [{ source: tweetId, ref: 'Tweet' }];
      await newUser.save();
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
      expect(response.status).toEqual(200);
      expect(user.likes.length).toBe(0);
      expect(user.likes[0]).toBeUndefined();
      expect(tweet.likes).toBe(0);
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
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const tweetId = mongoose.Types.ObjectId();
      const response = await request(app).patch(
        `/users/tweets/${tweetId}/like`,
      );
      expect(response.status).toEqual(401);
    });
  });
  describe('patch /users/:userId/', (): void => {
    it('should follow a user', async (): Promise<void> => {
      expect.assertions(4);
      const newAuthenticatedUser = new User({
        username: 'authenticatedUser',
        handle: 'authenticatedUserHandle',
        email: 'authenticatedUser@mail.com',
        password,
      });
      await newAuthenticatedUser.save();
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const authenticatedUserId = newAuthenticatedUser._id;
      const userId = newUser._id;
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
      expect(response.status).toEqual(200);
      expect(authenticatedUser.following.length).toBe(1);
      expect(authenticatedUser.following[0].equals(userId)).toBeTruthy();
      expect(user.followers).toBe(1);
    });
    it('should remove a followed user', async (): Promise<void> => {
      expect.assertions(4);
      const newAuthenticatedUser = new User({
        username: 'authenticatedUser',
        handle: 'authenticatedUserHandle',
        email: 'authenticatedUser@mail.com',
        password,
      });
      await newAuthenticatedUser.save();
      const authenticatedUserId = newAuthenticatedUser._id;
      const newUser = new User({
        username,
        handle,
        email,
        password,
        followers: 1,
      });
      await newUser.save();
      const userId = newUser._id;
      newAuthenticatedUser.following = [userId];
      await newAuthenticatedUser.save();
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
      expect(response.status).toEqual(200);
      expect(authenticatedUser.following.length).toBe(0);
      expect(authenticatedUser.following[0]).toBeUndefined();
      expect(user.followers).toBe(0);
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
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId();
      const response = await request(app).patch(`/users/${userId}`);
      expect(response.status).toEqual(401);
    });
  });
  describe('get /users/user/bookmarks', (): void => {
    it('should get a list of bookmarks', async (): Promise<void> => {
      expect.assertions(1);
      const validUserId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: validUserId,
      });
      await newTweet.save();
      const newUser = new User({
        username,
        handle,
        email,
        password,
        bookmarks: [{ source: newTweet._id, ref: 'Tweet' }],
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(200);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).get(`/users/user/bookmarks`);
      expect(response.status).toEqual(401);
    });
  });
  describe('get /users/:userId/likes', (): void => {
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
      const newUser = new User({
        username,
        handle,
        email,
        password,
        likes: [{ source: newTweet._id, ref: 'Tweet' }],
      });
      await newUser.save();
      const userId = newUser._id;
      const response = await request(app).get(`/users/${userId}/likes`);
      expect(response.status).toEqual(200);
    });
    it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId();
      const response = await request(app).get(`/users/${userId}/likes`);
      expect(response.status).toEqual(404);
    });
  });
  describe('get /users/:searchTerm', (): void => {
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
      expect(response.status).toEqual(200);
      expect(users).toHaveLength(1);
    });
  });
  describe('get /users/user/tweets', (): void => {
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
      const newUser = new User({
        username,
        handle,
        email,
        password,
        following: [followedUserId],
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(200);
      expect(tweets).toHaveLength(1);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
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
      const newUser = new User({
        username,
        handle,
        email,
        password,
        following: [followedUserId],
      });
      await newUser.save();
      const response = await request(app).get(`/users/user/tweets`);
      expect(response.status).toEqual(401);
    });
    it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
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
      const newUser = new User({
        username,
        handle,
        email,
        password,
        following: [followedUserId],
      });
      await newUser.save();
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
      expect(response.status).toEqual(404);
    });
  });
  describe('delete /users', (): void => {
    it('should delete a user', async (): Promise<void> => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
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
      expect(response.status).toEqual(204);
    });
    it('should throw an error with a status of 404: NotFound when the user is not found', async (): Promise<
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
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).delete(`/users`);
      expect(response.status).toEqual(401);
    });
  });
});
