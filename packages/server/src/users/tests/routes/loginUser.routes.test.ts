import mongoose from 'mongoose';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import connectToDB from 'utilities/connectToDB';

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
  const email = 'testmailmail.com';
  const password = 'testPassword';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  describe('post /users/user/tokens', () => {
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
});
