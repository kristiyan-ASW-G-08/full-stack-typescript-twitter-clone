import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockFs from 'mock-fs';
import mjml from 'mjml';
import app from 'src/app';
import User from 'src/users/User';
import UserType from '@customTypes/User';
import connectToDB from '@utilities/connectToDB';
import Tweet from 'src/tweets/Tweet';
import uploadToCloudinary from '@utilities/uploadToCloudinary';
import deleteFromCloudinary from '@utilities/deleteFromCloudinary';

jest.mock('@utilities/uploadToCloudinary');

jest.mock('@utilities/deleteFromCloudinary');

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

describe('tweetRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';
  const link = 'https://fakeLink.fakeLink';
  const secret = process.env.SECRET;
  let testUser: UserType;

  beforeEach(async () => {
    await User.deleteMany({}).exec();
    testUser = new User({
      username,
      handle,
      email,
      password,
    });
    await testUser.save();
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
  describe('patch /tweets/:tweetId', () => {
    it('should update a text tweet', async () => {
      expect.assertions(2);
      const newText = 'newTestText';
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
        .patch(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'text',
          text: newText,
        });
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(response.status).toBe(204);
      expect(tweet.text).toMatch(newText);
    });
    it('should update a link tweet', async () => {
      expect.assertions(2);
      const newLink = 'https://fakeNewLink.com';
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'link',
        link,
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
        .patch(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'link',
          linkUrl: newLink,
        });
      const tweet = await Tweet.findById(tweetId);
      if (!tweet) {
        return;
      }
      expect(response.status).toBe(204);
      expect(tweet.link).toMatch(newLink);
    });
    it("should throw an error with a status of 400: BadRequest when the req body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'link',
        link,
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
        .patch(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(400);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const newLink = 'https://fakeNewLink.com';
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'link',
        link,
        user: userId,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const response = await request(app)
        .patch(`/tweets/${tweetId}`)
        .send({
          type: 'link',
          linkUrl: newLink,
        });
      expect(response.status).toBe(401);
    });
    it('should throw an error with a status of 404: NotFound when the tweet is not found', async (): Promise<
      void
    > => {
      const newLink = 'https://fakeNewLink.com';
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          type: 'link',
          linkUrl: newLink,
        });
      expect(response.status).toBe(404);
    });
  });
});
