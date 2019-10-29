import axios from 'axios';
import { wait } from '@testing-library/react';
import getTweets from './getTweets';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
const data = {
  data: { tweets: [], links: { next: null, prev: null } },
};
axiosMock.get.mockResolvedValue({
  data,
});

describe('getTweets', () => {
  const url = 'url';
  it('resolves', async () => {
    expect.assertions(3);
    await expect(getTweets(url)).resolves.toEqual({
      newTweets: [],
      next: null,
      prev: null,
    });
    await wait(() => {
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith(url, {});
    });
  });
});
