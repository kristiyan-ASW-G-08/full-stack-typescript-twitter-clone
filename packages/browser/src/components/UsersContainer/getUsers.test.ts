import axios from 'axios';
import { wait } from '@testing-library/react';
import getUsers from './getUsers';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
const data = {
  data: { users: [], links: { next: null, prev: null } },
};
axiosMock.get.mockResolvedValue({
  data,
});

describe('getUsers', () => {
  const url = 'url';
  it('resolves', async () => {
    expect.assertions(3);
    await expect(getUsers(url)).resolves.toEqual({
      nextUsers: [],
      next: null,
      prev: null,
    });
    await wait(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(url);
    });
  });
});
