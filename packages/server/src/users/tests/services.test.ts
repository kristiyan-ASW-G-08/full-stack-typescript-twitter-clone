import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import {
  areCredentialsAvailable,
  getUserById,
  getUserByEmail,
} from 'src/users/services';
import User from 'src/users/User';
import db from 'src/db';
import getResource from '@utilities/getResource';

jest.mock('@utilities/getResource');

const getResourceMock = getResource as jest.MockedFunction<typeof getResource>;

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
    it(`should call getResource`, async (): Promise<void> => {
      expect.assertions(2);
      await getUserByEmail(email);

      expect(getResource).toHaveBeenCalledTimes(1);
      expect(getResourceMock).toHaveBeenCalledWith(User, {
        name: 'email',
        value: email,
      });
    });
  });
  describe('getUserById', (): void => {
    it(`should call getResource`, async (): Promise<void> => {
      expect.assertions(2);
      const userId = 'userId';
      await getUserById(userId);

      expect(getResource).toHaveBeenCalledTimes(1);
      expect(getResourceMock).toHaveBeenCalledWith(
        User,
        {
          name: '_id',
          value: userId,
        },
        '',
      );
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
});
