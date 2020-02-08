import mongoose from 'mongoose';
import User from 'src/users/User';
import UserType from '@customTypes/User';
import connectToDB from '@utilities/connectToDB';
import duplicationErrorHandler from '@customMiddleware/duplicationErrorHandler';

jest.mock('@customMiddleware/duplicationErrorHandler');

const duplicationErrorHandlerMock = duplicationErrorHandler as jest.MockedFunction<
  typeof duplicationErrorHandler
>;

describe('User', (): void => {
  const { MONGO_USER, MONGO_PASSWORD, MONGO_DATABASE } = process.env;
  const mongoURI = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@cluster0-zmcyw.mongodb.net/${MONGO_DATABASE}?retryWrites=true`;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testEmail@mail.com';
  const password = 'testPassword';
  beforeAll(
    async (): Promise<void> => {
      await connectToDB(mongoURI);
      await User.deleteMany({}).exec();
    },
  );
  afterEach(
    async (): Promise<void> => {
      await User.deleteMany({}).exec();
    },
  );
  afterAll(
    async (): Promise<void> => {
      await mongoose.disconnect();
    },
  );
  it('should throw an error when validation is not passed', async () => {
    expect.assertions(3);
    const userObj = {
      username,
      handle,
      email,
      password,
    };
    await User.insertMany([userObj]);
    const user = new User(userObj);
    await expect(user.save()).rejects.toThrowError();
    expect(duplicationErrorHandlerMock).toHaveBeenCalledTimes(0);
    expect(user.validate).toThrowError();
  });
  it('should create a new user when validation is successful', async (): Promise<
    void
  > => {
    expect.assertions(16);

    const user: UserType = new User({
      username,
      handle,
      email,
      password,
    });
    await expect(user.save()).resolves.not.toThrowError();
    expect(duplicationErrorHandlerMock).toHaveBeenCalledTimes(1);
    expect(user).toMatchObject({
      username,
      handle,
      email,
      password,
    });
    expect(user.username).toBe(username);
    expect(user.handle).toBe(handle);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
    expect(user.isConfirmed).toBeFalsy();
    expect(user.date).toBeDefined();
    expect(user._id).toBeDefined();
    expect(user.followers).toBe(0);
    expect(user.following.length).toBe(0);
    expect(user.likes.length).toBe(0);
    expect(user.bookmarks.length).toBe(0);
    expect(user.retweets.length).toBe(0);
    expect(user.replies.length).toBe(0);
  });
});
