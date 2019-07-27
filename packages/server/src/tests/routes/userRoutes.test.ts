import mongoose from 'mongoose';
import request from 'supertest';
import app from 'src/app';
import User from '@models/User';
import db from 'src/db';

import sendEmail from '@utilities/sendEmail';

const port = process.env.PORT || 8080;

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
  });
});
