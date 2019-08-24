import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import mockFs from 'mock-fs';
import mjml from 'mjml';
import app from 'src/app';
import User from '@models/User';
import db from 'src/db';
import Reply from '@models/Reply';

const port = process.env.PORT || 8080;
// Temporary code:The reply routes don't call mjml, but removing its mock causes issues
const mockTemplate = 'MockTemplate';
(mjml as jest.Mock).mockReturnValue(mockTemplate);
jest.mock('mjml');

describe('replyRoute', (): void => {
  beforeAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
      await db();
      app.listen(port);
      await Reply.deleteMany({}).exec();
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      mockFs.restore();
      await Reply.deleteMany({}).exec();
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
  const secret = process.env.SECRET;
  describe('post /tweets/:tweetId/replies', (): void => {
    it('should create a new reply', async (): Promise<void> => {
      expect.assertions(1);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
      const tweetId = mongoose.Types.ObjectId();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .post(`/tweets/${tweetId}/replies`)
        .send({
          text,
        })
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(200);
    });

    it('should throw an error with a status of 400: BadRequest when the request body validation fails', async (): Promise<
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
      const tweetId = mongoose.Types.ObjectId();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .post(`/tweets/${tweetId}/replies`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(400);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const tweetId = mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/tweets/${tweetId}/replies`)
        .send({
          text,
        });
      expect(response.status).toEqual(401);
    });
  });
  describe('patch /replies/:replyId', (): void => {
    const newText = 'newTestText';
    it('should update a reply', async (): Promise<void> => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Reply({
        text,
        user: userId,
        tweet: tweetId,
      });
      await newReply.save();
      const replyId = newReply._id;
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/replies/${replyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: newText,
        });
      const reply = await Reply.findById(replyId);
      if (!reply) {
        return;
      }
      expect(response.status).toEqual(204);
      expect(reply.text).toMatch(newText);
    });

    it('should throw an error with a status of 404: NotFound when the reply is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const replyId = mongoose.Types.ObjectId();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/replies/${replyId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          text: newText,
        });
      expect(response.status).toEqual(404);
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Reply({
        text,
        user: userId,
        tweet: tweetId,
      });
      await newReply.save();
      const replyId = newReply._id;

      const response = await request(app)
        .patch(`/replies/${replyId}`)
        .send({
          text: newText,
        });
      expect(response.status).toEqual(401);
    });
    it("should throw an error with a status of 400: BadRequest when the request body doesn't pass validation", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Reply({
        text,
        user: userId,
        tweet: tweetId,
      });
      await newReply.save();
      const replyId = newReply._id;
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .patch(`/replies/${replyId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(400);
    });
  });
  describe('delete /replies/:replyId', (): void => {
    it('should delete a reply', async (): Promise<void> => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Reply({
        text,
        user: userId,
        tweet: tweetId,
      });
      const replyId = newReply._id;
      await newReply.save();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(`/replies/${replyId}`)
        .set('Authorization', `Bearer ${token}`);
      const reply = await Reply.findById(replyId);
      expect(response.status).toEqual(204);
      expect(reply).toBeNull();
    });
    it('should throw an error with a status of 401: Unauthorized when there is no authorization header or its contents are invalid', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const unauthorizedUserId = mongoose.Types.ObjectId().toString();
      const userId = mongoose.Types.ObjectId().toString();
      const tweetId = mongoose.Types.ObjectId().toString();
      const newReply = new Reply({
        text,
        user: userId,
        tweet: tweetId,
      });
      const replyId = newReply._id;
      await newReply.save();
      const token = jwt.sign(
        {
          userId: unauthorizedUserId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(`/replies/${replyId}`)
        .set('Authorization', `Bearer ${token}`);
      const reply = await Reply.findById(replyId);
      expect(response.status).toEqual(401);
      expect(reply).not.toBeNull();
    });
    it('should throw an error with a status of 404: NotFound when the reply is not found', async (): Promise<
      void
    > => {
      expect.assertions(1);
      const userId = mongoose.Types.ObjectId().toString();
      const replyId = mongoose.Types.ObjectId().toString();
      const token = jwt.sign(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      const response = await request(app)
        .delete(`/replies/${replyId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toEqual(404);
    });
  });
});
