import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockFs from 'mock-fs';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import connectToDB from 'utilities/connectToDB';
import Tweet from 'src/tweets/Tweet';

jest.mock('utilities/uploadToCloudinary', () =>
  jest.fn(() => Promise.resolve({ public_id: 'public_id' })),
);

jest.mock('utilities/deleteFromCloudinary');

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

describe('tweetRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}cluster0.ol9wi.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmailmail.com';
  const password = 'testPassword';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const link = 'https://fakeLink.fakeLink';
  const secret = process.env.SECRET;
  let token: string;

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    const user = new User({
      username,
      handle,
      email,
      password,
    });
    await user.save();
    token = jwt.sign(
      {
        userId: user._id,
      },
      secret,
      { expiresIn: '1h' },
    );
  });
  afterEach(async () => {
    mockFs.restore();
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

  describe('post /tweets', () => {
    it('should create a new text tweet', async () => {
      expect.assertions(1);

      const type = 'text';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });
    it('should create a new link tweet', async () => {
      expect.assertions(1);

      const type = 'link';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          linkUrl: link,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });
    it('should create a new retweet', async () => {
      expect.assertions(1);

      const tweet = new Tweet({
        type: 'link',
        link,
        user: mongoose.Types.ObjectId(),
      });
      await tweet.save();
      const retweetId = tweet._id;

      const type = 'retweet';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
          retweetId,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });
    it('should create a new reply tweet', async () => {
      expect.assertions(1);

      const tweet = new Tweet({
        type: 'link',
        link,
        user: mongoose.Types.ObjectId(),
      });
      await tweet.save();
      const replyId = tweet._id;

      const type = 'reply';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
          replyId,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });
    it('should create a new image tweet', async () => {
      expect.assertions(1);

      mockFs({
        './images': {
          'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
        },
      });
      const type = 'text';
      const response = await request(app)
        .post('/tweets')
        .field({
          type,
          text,
        })
        .attach('image', './images/test.jpg')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(201);
    });

    it("should throw an error with a status of 400: BadRequest when the tweet type and the content don't match", async (): Promise<
      void
    > => {
      expect.assertions(1);

      const type = 'retweet';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const type = 'text';
      const response = await request(app)
        .post('/tweets')
        .send({
          type,
          text,
        });
      expect(response.status).toBe(401);
    });
  });
});
