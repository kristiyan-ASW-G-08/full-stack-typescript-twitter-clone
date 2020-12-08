import mongoose from 'mongoose';
import request from 'supertest';
import mockFs from 'mock-fs';
import mjml from 'mjml';
import app from 'src/app';
import connectToDB from '@utilities/connectToDB';
import Tweet from 'src/tweets/Tweet';

const port = process.env.PORT || 8080;
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

describe('tweetRoutes', () => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel alias, amet corporis modi corrupti.';

  afterEach(async () => {
    mockFs.restore();
    await Tweet.deleteMany({}).exec();
  });
  beforeAll(async () => {
    await mongoose.disconnect();
    await connectToDB(mongoURI);
    app.listen(port);
    await Tweet.deleteMany({}).exec();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  describe('get /tweets/:tweetId', () => {
    it('should get a tweet', async () => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId();
      const newTweet = new Tweet({
        type: 'text',
        text,
        user: userId,
      });
      await newTweet.save();
      const { _id } = newTweet;
      const response = await request(app).get(`/tweets/${_id}`);
      const { tweet } = response.body.data;
      expect(response.status).toBe(200);
      expect(tweet._id.toString()).toMatch(_id.toString());
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
});
