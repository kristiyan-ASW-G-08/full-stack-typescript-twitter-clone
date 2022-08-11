import { getUserById, getUserByEmail } from 'src/users/services';
import User from 'src/users/User';
import getResource from 'utilities/getResource';

jest.mock('utilities/getResource');

const getResourceMock = getResource as jest.MockedFunction<typeof getResource>;

describe('userServices', (): void => {
  afterEach(() => jest.clearAllMocks());
  describe('getUserByEmail', (): void => {
    it(`should call getResource`, async (): Promise<void> => {
      const email = 'testmailmail.com';
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
});
