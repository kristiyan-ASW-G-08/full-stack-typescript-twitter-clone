import mongoose from 'mongoose';
import User from 'src/models/User';
import UserType from 'src/types/User';
import db from 'src/db';

describe('User model', (): void => {
  beforeAll(
    async (): Promise<void> => {
      db();
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
  it('Should throw validation error', (): void => {
    const user = new User();

    expect(user.validate).toThrow();
  });
  it('should save a user', async (): Promise<void> => {
    expect.assertions(6);
    const username = 'handle';
    const handle = 'testUserHandle';
    const email = 'testEmail@mail.com';
    const password = 'testPassword';
    const user: UserType = new User({
      username,
      handle,
      email,
      password,
    });
    const spy = jest.spyOn(user, 'save');
    user.save();

    expect(spy).toHaveBeenCalled();
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
  });
});
