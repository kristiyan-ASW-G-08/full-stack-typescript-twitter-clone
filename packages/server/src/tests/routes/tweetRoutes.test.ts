import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mjml from 'mjml';
import app from 'src/app';
import User from '@models/User';
import db from 'src/db';
import Tweet from '@models/Tweet';

const port = process.env.PORT || 8080;
// Temporary comment:The tweet routes don't call mjml, but removing its mock causes issues
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

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
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const link = 'https://fakeLink.fakeLink';
  const secret = process.env.SECRET;
  describe('/tweets', (): void => {
    it('should create a new text tweet', async (): Promise<void> => {
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
      const type = 'text';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });
    it('should create a new link tweet', async (): Promise<void> => {
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
      const type = 'link';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          linkUrl: link,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    it('should throw an error', async (): Promise<void> => {
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
      const type = 'link';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(400);
    });
    it('should throw an error', async (): Promise<void> => {
      expect.assertions(1);
      const type = 'text';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
        });
      expect(response.status).toEqual(401);
    });
  });
});
