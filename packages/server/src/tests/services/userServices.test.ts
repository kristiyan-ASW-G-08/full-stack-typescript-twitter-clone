import mongoose from 'mongoose';
import { createUser } from '@services/userServices';
import User from '@models/User';
import db from 'src/db';
import bcrypt from 'bcryptjs';

describe('userServices', (): void => {
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
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testEmail@mail.com';
  const password = 'testPassword';
  describe('createUser', (): void => {
    it(`should create a new user`, async (): Promise<void> => {
      expect.assertions(7);
      const hashMock = jest.spyOn(bcrypt, 'hash');
      const userId = await createUser(username, handle, email, password);
      expect(userId).toBeTruthy();
      const user = await User.findById(userId);
      if (!user) {
        return;
      }
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
      expect(user.password).not.toMatch(password);
      expect(hashMock).toHaveBeenCalledTimes(1);
      expect(hashMock).toHaveBeenCalledWith(password, 12);
      hashMock.mockRestore();
    });
  });
  it('should throw a mongo duplicate key error', async (): Promise<void> => {
    expect.assertions(1);
    await User.insertMany({ username, handle, email, password });
    await expect(
      createUser(username, handle, email, password),
    ).rejects.toThrow();
  });
});
