import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  createUser,
  sendConfirmationEmail,
  sendPasswordResetEmail,
  checkCredentialsAvailability,
  comparePasswords,
  checkUserConfirmation,
  getUserById,
  getUserByEmail,
} from '@services/userServices';
import User from '@models/User';
import db from 'src/db';
import sendEmail from '@utilities/sendEmail';
import { CustomError, errors } from '@utilities/CustomError';

jest.mock('@utilities/sendEmail');
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
  const secret = process.env.SECRET;
  const username = 'username';
  const handle = 'testUserHandle';
  const email = 'testmail@mail.com';
  const password = 'testPassword';
  describe('createUser', (): void => {
    it(`should create a new user`, async (): Promise<void> => {
      expect.assertions(7);
      const hashMock = jest.spyOn(bcrypt, 'hash');
      const { userId } = await createUser(username, handle, email, password);
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
  it('should throw an error', async (): Promise<void> => {
    expect.assertions(1);
    await User.insertMany({ username, handle, email, password });
    await expect(
      createUser(username, handle, email, password),
    ).rejects.toThrow();
  });
  describe('getUserByEmail', (): void => {
    it(`should get a user`, async (): Promise<void> => {
      const newUser = new User({
        username,
        handle,
        email,
        password,
      });
      await newUser.save();
      const { user } = await getUserByEmail(email);
      if (!user) {
        return;
      }
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
    });

    it(`should throw an error`, async (): Promise<void> => {
      const { status, message } = errors.NotFound;
      const error = new CustomError(status, message);
      await expect(getUserByEmail(email)).rejects.toThrow(error);
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
      const { user } = await getUserById(userId);
      if (!user) {
        return;
      }
      expect(user.username).toMatch(username);
      expect(user.handle).toMatch(handle);
      expect(user.email).toMatch(email);
    });

    it(`should throw an error`, async (): Promise<void> => {
      const { status, message } = errors.NotFound;
      const error = new CustomError(status, message);
      const userId = mongoose.Types.ObjectId().toString();
      await expect(getUserById(userId)).rejects.toThrow(error);
    });
  });
  describe('sendConfirmationEmail', (): void => {
    it(`should call sign and sendEmail`, async (): Promise<void> => {
      expect.assertions(4);
      const userId = mongoose.Types.ObjectId().toString();
      sendConfirmationEmail(userId, email);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toMatchSnapshot();
    });
  });
  describe('sendPasswordRequestEmail', (): void => {
    it(`should call sign and sendEmail`, async (): Promise<void> => {
      expect.assertions(4);
      const userId = mongoose.Types.ObjectId().toString();
      sendPasswordResetEmail(userId, email);
      expect(jwt.sign).toHaveBeenCalledTimes(1);
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          userId,
        },
        secret,
        { expiresIn: '1h' },
      );
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toMatchSnapshot();
    });
  });
  describe('checkCredentialsAvailability', (): void => {
    it('should throw a validationError error', async (): Promise<void> => {
      expect.assertions(1);

      await User.insertMany({ username, handle, email, password });
      await expect(
        checkCredentialsAvailability(username, handle, email),
      ).rejects.toThrow();
    });
    it('should not throw an error', async (): Promise<void> => {
      expect.assertions(1);
      await expect(
        checkCredentialsAvailability(username, handle, email),
      ).resolves.toBeUndefined();
    });
  });

  describe('comparePasswords', (): void => {
    let hashedPassword: string;
    beforeEach(
      async (): Promise<void> => {
        hashedPassword = await bcrypt.hash(password, 12);
      },
    );
    it(`should throw an error`, async (): Promise<void> => {
      const incorrectPassword = 'incorrectPassword';
      const { status, message } = errors.Unauthorized;
      const error = new CustomError(status, message);
      await expect(
        comparePasswords(incorrectPassword, hashedPassword),
      ).rejects.toThrow(error);
    });
    it(`should not throw an error`, async (): Promise<void> => {
      await expect(comparePasswords(password, hashedPassword)).toEqual(
        Promise.resolve({}),
      );
    });
  });
  describe('checkUserConfirmation', (): void => {
    it(`should throw an error`, async (): Promise<void> => {
      const user = new User({
        username,
        handle,
        email,
        password,
      });
      await user.save();
      const { status, message } = errors.Unauthorized;
      const error = new CustomError(status, message);
      await expect(checkUserConfirmation(user)).rejects.toThrow(error);
    });
    it(`should not throw an error`, async (): Promise<void> => {
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
