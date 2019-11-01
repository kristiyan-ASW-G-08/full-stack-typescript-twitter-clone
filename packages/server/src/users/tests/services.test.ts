import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {
  areCredentialsAvailable,
  checkUserConfirmation,
  getUserById,
  getUserByEmail,
} from 'src/users/services';
import User from 'src/users/User';
import db from 'src/db';

jest.mock('jsonwebtoken');

const mockToken = 'mockToken';
(jwt.sign as jest.Mock).mockReturnValue(mockToken);

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
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  describe('getUserByEmail', (): void => {
    expect.assertions(3);
    it(`should get a user`, async (): Promise<void> => {
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const user = await getUserByEmail(email);
      if (!user) {
        return;
      }
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
    });

    it('should throw an error when the user is not found', async (): Promise<
      void
    > => {
      expect.assertions(2);
      await expect(getUserByEmail(email)).rejects.toThrow();
      await expect(getUserByEmail(email)).rejects.toMatchSnapshot();
    });
  });
  describe('getUserById', (): void => {
    it(`should get a user`, async (): Promise<void> => {
      expect.assertions(3);
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const userId = newUser._id;
      const user = await getUserById(userId);
      if (!user) {
        return;
      }
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
    });

    it('should throw an error should throw an error when the user is not found', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const userId = mongoose.Types.ObjectId().toString();
      await expect(getUserById(userId)).rejects.toThrow();
      await expect(getUserById(userId)).rejects.toMatchSnapshot();
    });
  });

  describe('areCredentialsAvailable', (): void => {
    it('should throw an error when the user credentials are already taken', async (): Promise<
      void
    > => {
      expect.assertions(2);
      const credentials: {
        path: 'username' | 'handle' | 'email';
        value: string;
      }[] = [
        { path: 'username', value: username },
        { path: 'handle', value: handle },
        { path: 'email', value: email },
      ];
      await User.insertMany({ username, handle, email, password });
      await expect(areCredentialsAvailable(credentials)).rejects.toThrow();
      await expect(
        areCredentialsAvailable(credentials),
      ).rejects.toMatchSnapshot();
    });
    it("shouldn't throw an error when the user credentials are available", async (): Promise<
      void
    > => {
      const credentials: {
        path: 'username' | 'handle' | 'email';
        value: string;
      }[] = [
        { path: 'username', value: username },
        { path: 'handle', value: handle },
        { path: 'email', value: email },
      ];
      expect.assertions(1);
      await expect(
        areCredentialsAvailable(credentials),
      ).resolves.toBeUndefined();
    });
  });
  describe('checkUserConfirmation', (): void => {
    it("should throw an error the user hasn't confirmed his email address", async (): Promise<
      void
    > => {
      expect.assertions(2);
      const user = new User({
        username,
        handle,
        email,
        password,
      });
      await user.save();
      await expect(checkUserConfirmation(user)).rejects.toThrow();
      await expect(checkUserConfirmation(user)).rejects.toMatchSnapshot();
    });
    it("shouldn't throw an error when the user confirmed his email address", async (): Promise<
      void
    > => {
      expect.assertions(1);
      const user = new User({
        username,
        handle,
        email,
        password,
      });
      user.confirmed = true;
      await user.save();
      await expect(checkUserConfirmation(user)).toEqual(Promise.resolve());
    });
  });
});
