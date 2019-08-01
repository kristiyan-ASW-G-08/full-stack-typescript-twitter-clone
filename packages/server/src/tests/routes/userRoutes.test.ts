import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from '@models/User';
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
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
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
    it('should not create a new user', async (): Promise<void> => {
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
    it('should not create a new user', async (): Promise<void> => {
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
    it('should not create a new user', async (): Promise<void> => {
      expect.assertions(3);
      const response = await request(app).post('/users');
      expect(response.status).toEqual(400);
      expect(response.body).toMatchSnapshot();
      expect(sendEmail).not.toHaveBeenCalled();
    });
  });
  describe('/users/tokens', (): void => {
    it('should get a authentication token and user data', async (): Promise<
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
    it('should throw an error', async (): Promise<void> => {
      expect.assertions(1);
      const response = await request(app)
        .post('/users/tokens')
        .send({
          email,
          password,
        });
      expect(response.status).toEqual(404);
    });
    it('should throw an error', async (): Promise<void> => {
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
    it('should throw an error', async (): Promise<void> => {
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
    it('should throw an error', async (): Promise<void> => {
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
      });
      await newUser.save();
      const response = await request(app).post(`/users/${email}`);
      expect(response.status).toEqual(204);
    });
    it('should throw an error', async (): Promise<void> => {
      expect.assertions(1);
      const response = await request(app).post(`/users/${email}`);
      expect(response.status).toEqual(404);
    });
  });
});
