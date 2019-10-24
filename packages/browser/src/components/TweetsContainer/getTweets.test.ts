import axios from 'axios';
import getTweets from './getTweets';
import { wait } from '@testing-library/react';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
const data = {
  data: { tweets: [], links: { next: null, prev: null } },
};
axiosMock.get.mockResolvedValue({
  data,
});

describe('getTweets', () => {
  const setNotification = jest.fn();
  const url = 'url';
  it('resolves', async () => {
    expect.assertions(3);
    await expect(getTweets(url, setNotification)).resolves.toEqual({
      newTweets: [],
      next: null,
      prev: null,
    });
    await wait(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(url, {});
    });
  });

  it('rejects', async () => {
    expect.assertions(2);
    axiosMock.get.mockReturnValue(Promise.reject({ status: 500 }));
    await expect(getTweets(url, setNotification)).resolves.toBeUndefined();
    expect(setNotification).toHaveBeenCalledTimes(1);
  });
});
