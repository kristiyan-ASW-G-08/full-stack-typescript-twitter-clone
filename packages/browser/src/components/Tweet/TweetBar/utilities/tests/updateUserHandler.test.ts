import user from 'testUtilities/user';
import defaultWarning from 'utilities/defaultWarning';
import updateUserHandler from '../updateUserHandler';
import getUpdatedUser from '../getUpdatedUser';

jest.mock('../getUpdatedUser');
jest.mock('axios');
const getUpdatedUserMock = getUpdatedUser as jest.Mock<any>;
getUpdatedUserMock.mockResolvedValue(user);

describe('updateUserHandler', () => {
  const url = 'url';
  const token = 'token';
  const setNotification = jest.fn();
  const updateUser = jest.fn();
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.resetAllMocks());
  it('resolves:should call updateUser', async () => {
    expect.assertions(2);
    await updateUserHandler(token, url, setNotification, updateUser);

    expect(updateUser).toHaveBeenCalledTimes(1);
    expect(updateUser).toHaveBeenCalledWith(user);
  });

  it('reject: should call setNotification', async () => {
    expect.assertions(2);
    getUpdatedUserMock.mockRejectedValueOnce({});
    await updateUserHandler(token, url, setNotification, updateUser);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(defaultWarning);
  });
});
