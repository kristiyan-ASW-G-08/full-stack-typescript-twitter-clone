import mongoose from 'mongoose';
import Reply from '@models/Reply';
import User from '@models/User';
import ReplyType from '@customTypes/Reply';
import db from 'src/db';

describe('Reply model', (): void => {
  beforeAll(
    async (): Promise<void> => {
      db();
      await User.deleteMany({}).exec();
      await Reply.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
      await Reply.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  it('should throw an error when the object passed to the model does not pass validation', (): void => {
    const reply = new Reply();
    expect(reply.validate).toThrow();
  });
  it('should create a new Reply when validation is successful', async (): Promise<
    void
  > => {
    expect.assertions(3);
    const user = mongoose.Types.ObjectId().toString();
    const tweet = mongoose.Types.ObjectId().toString();
    const text = 'text';
    const reply: ReplyType = new Reply({
      user,
      text,
      tweet,
    });
    const saveSpy = jest.spyOn(reply, 'save');
    await reply.save();
    expect(saveSpy).toHaveBeenCalled();
    expect(reply.user.toString()).toMatch(user.toString());
    expect(reply.text).toMatch(text);
    saveSpy.mockRestore();
  });
});
