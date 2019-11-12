import axios from 'axios';
import { wait } from '@testing-library/react';
import user from 'testUtilities/user';
import getUpdatedUser from '../getUpdatedUser';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.patch.mockResolvedValue({
  data: { data: { user } },
});

describe('getUpdatedUser', () => {
  const url = 'url';
  const token = 'token';
  it('resolves', async () => {
    expect.assertions(3);
    await expect(getUpdatedUser(token, url)).resolves.toEqual(user);
    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
      expect(axios.patch).toHaveBeenCalledWith(
        url,
        {},
        { headers: { Authorization: `bearer ${token}` } },
      );
    });
  });
});
