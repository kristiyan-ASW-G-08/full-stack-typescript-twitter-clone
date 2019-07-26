import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, sendConfirmationEmail } from '@services/userServices';
import User from '@models/User';
import db from 'src/db';
import sendEmail from '@utilities/sendEmail';
import MailOptions from '@customTypes/MailOptions';

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
  const email = 'bestestkris@gmail.com';
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
  describe('sendConfirmationEmail', (): void => {
    it(`should call sign and sendEmail`, async (): Promise<void> => {
      const appEmail = process.env.EMAIL;
      const clientUri = process.env.CLIENT_URI;
      const url = `${clientUri}/confirmation/${mockToken}`;
      const mailOptions: MailOptions = {
        from: appEmail,
        to: email,
        subject: 'TwittClone Email Confirmation',
        html: `Confirm your email: <a href="${url}">${url}</a>`,
      };
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
      expect(sendEmail).toHaveBeenCalledWith(mailOptions);
    });
  });
});