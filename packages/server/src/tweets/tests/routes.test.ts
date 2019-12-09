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

  describe('post /tweets', () => {
    it('should create a new text tweet', async () => {
      expect.assertions(1);
      const userId = testUser._id;
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
      expect(response.status).toBe(201);
    });
    it('should create a new link tweet', async () => {
      expect.assertions(1);
      const userId = testUser._id;
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
      expect(response.status).toBe(201);
    });
    it('should create a new retweet', async () => {
      expect.assertions(1);
      const userId = testUser._id;
      const tweet = new Tweet({
        type: 'link',
        link,
        user: userId,
      });
      await tweet.save();
      const retweetId = tweet._id;
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
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
      const userId = testUser._id;
      const tweet = new Tweet({
        type: 'link',
        link,
        user: userId,
      });
      await tweet.save();
      const replyId = tweet._id;
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
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
      const userId = testUser._id;
      mockFs({
        './images': {
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
      const userId = testUser._id;

      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
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
  describe('delete /tweets/:tweetId', () => {
    it('should delete a tweet', async () => {
      expect.assertions(2);
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: testUser._id,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const token = jwt.sign(
        {
          userId: testUser._id,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(`/tweets/${tweetId}`)
        .set('Authorization', `Bearer ${token}`);
      const tweet = await Tweet.findById(tweetId);
      expect(response.status).toBe(204);
      expect(tweet).toBeNull();
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(2);

      const unauthorizedUserId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: testUser._id,
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
      expect(response.status).toBe(401);
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
      expect(response.status).toBe(404);
    });
  });
  describe('get /tweets/:tweetId', () => {
    it('should get a tweet', async () => {
      expect.assertions(2);
      const userId = testUser._id;
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const tweetId = newTweet._id;
      const response = await request(app).get(`/tweets/${tweetId}`);
      const { tweet } = response.body.data;
      expect(response.status).toBe(200);
      expect(tweet._id.toString()).toMatch(tweetId.toString());
    });
    it('should throw an error with a status of 404: NotFound when the tweet is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const tweetId = mongoose.Types.ObjectId();
      const response = await request(app).get(`/tweets/${tweetId}`);
      expect(response.status).toBe(404);
    });
  });
  describe('get /users/:userId/tweets', () => {
    it('should get a list of tweets', async () => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const response = await request(app).get(`/users/${userId}/tweets`);
      expect(response.status).toBe(200);
    });
  });
  describe('get /tweets', () => {
    it('should get a list of tweets', async () => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const response = await request(app).get(`/tweets`);
      expect(response.status).toBe(200);
    });
  });
  describe('get /tweets/:tweetId/replies', () => {
    it('should get a list of replies by tweet', async () => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Tweet({
        text,
        type: 'reply',
        user: userId,
        reply: tweetId,
      });
      await newReply.save();
      const response = await request(app).get(`/tweets/${tweetId}/replies`);
      expect(response.status).toBe(200);
    });
  });
  describe('get /users/:userId/replies', () => {
    it('should get a list of replies by user', async () => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Tweet({
        text,
        type: 'reply',
        user: userId,
        reply: tweetId,
      });
      await newReply.save();
      const response = await request(app).get(`/users/${userId}/replies`);
      expect(response.status).toBe(200);
    });
  });
});
