import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockFs from 'mock-fs';
import mjml from 'mjml';
import app from 'src/app';
import User from '@models/User';
import db from 'src/db';
import Tweet from '@models/Tweet';

const port = process.env.PORT || 8080;
// Temporary code:The tweet routes don't call mjml, but removing its mock causes issues
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

describe('tweetRoutes', (): void => {
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
      mockFs.restore();
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
  describe('post /tweets', (): void => {
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
    it('should create a new image tweet', async (): Promise<void> => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
      mockFs({
        'assets/images': {
          'test.jpg': Buffer.from([8, 6, 7, 5, 3, 0, 9]),
        },
      });
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const type = 'image';
      const response = await request(app)
        .post('/tweets')
        .field({
          type,
          text,
        })
        .attach('image', 'assets/images/test.jpg')
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    it("should throw an error with a status of 400: BadRequest when the tweet type and the content don't match", async (): Promise<
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
      expect(response.status).toEqual(401);
    });
  });
  describe('patch /tweets/:tweetId', (): void => {
    it('should update a text tweet', async (): Promise<void> => {
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
      expect(response.status).toEqual(204);
      expect(tweet.text).toMatch(newText);
    });
    it('should update a link tweet', async (): Promise<void> => {
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
      expect(response.status).toEqual(204);
      expect(tweet.link).toMatch(newLink);
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
      expect(response.status).toEqual(404);
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
      expect(response.status).toEqual(401);
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
      expect(response.status).toEqual(400);
    });
  });
  describe('delete /tweets/:tweetId', (): void => {
    it('should delete a tweet', async (): Promise<void> => {
      expect.assertions(2);
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
        .delete(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      const tweet = await Tweet.findById(tweetId);
      expect(response.status).toEqual(204);
      expect(tweet).toBeNull();
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId().toString();
      const unauthorizedUserId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const token = jwt.sign(
        {
          userId: unauthorizedUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      const tweet = await Tweet.findById(tweetId);
      expect(response.status).toEqual(401);
      expect(tweet).not.toBeNull();
    });
    it('should throw an error with a status of 404: NotFound when the tweet is not found', async (): Promise<
      void
    > => {
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
        .delete(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
    });
  });
  describe('get /tweets/:tweetId', (): void => {
    it('should get a tweet', async (): Promise<void> => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const response = await request(app).get(`/tweets/${tweetId}`);
      const { tweet } = response.body.data;
      expect(response.status).toEqual(200);
      expect(tweet._id.toString()).toMatch(tweetId.toString());
    });
    it('should throw an error with a status of 404: NotFound when the tweet is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const tweetId = mongoose.Types.ObjectId();
      const response = await request(app).get(`/tweets/${tweetId}`);
      expect(response.status).toEqual(404);
    });
  });
});
