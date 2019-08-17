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
  describe('/users/tokens', (): void => {
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
        .post('/users/tokens')
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
        .post('/users/tokens')
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
      const response = await request(app).post('/users/tokens');
      expect(response.status).toEqual(400);
      expect(response.body).toMatchSnapshot();
    });
  });
  describe('/users', (): void => {
    it('should confirm user email', async (): Promise<void> => {
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
        .patch(`/users`)
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
        .patch(`/users`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).patch(`/users`);
      expect(response.status).toEqual(401);
    });
  });
  describe('/users/:email', (): void => {
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
      const response = await request(app).post(`/users/${email}`);
      expect(response.status).toEqual(204);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
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
      const response = await request(app).post(`/users/${email}`);
      expect(response.status).toEqual(401);
    });
    it("should throw an error with a status of 404: NotFound when the user doesn't exist", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const response = await request(app).post(`/users/${email}`);
      expect(response.status).toEqual(404);
    });
  });
  describe('/users/reset', (): void => {
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
        .patch(`/users/reset`)
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
        .patch(`/users/reset`)
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
        .patch(`/users/reset`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          password: newPassword,
          confirmPassword: newPassword,
        });
      expect(response.status).toEqual(404);
    });
  });
  describe('patch /users/tweets/:tweetId', (): void => {
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
        .patch(`/users/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      const user = await User.findById(userId);
      if (!user) return;
      expect(response.status).toEqual(200);
      expect(user.bookmarks.length).toBe(1);
      expect(user.bookmarks[0].equals(tweetId)).toBeTruthy();
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
      newUser.bookmarks = [tweetId];
      await newUser.save();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/users/tweets/${tweetId}`)
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
        .patch(`/users/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const tweetId = mongoose.Types.ObjectId();
      const response = await request(app).patch(`/users/tweets/${tweetId}`);
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
      expect(user.likes[0].equals(tweetId)).toBeTruthy();
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
      newUser.likes = [tweetId];
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
