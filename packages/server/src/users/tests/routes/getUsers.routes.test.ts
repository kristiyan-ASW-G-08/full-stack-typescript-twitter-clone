import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import connectToDB from '@utilities/connectToDB';

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');
jest.mock('@utilities/sendEmail');

describe('userRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
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
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
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
});
