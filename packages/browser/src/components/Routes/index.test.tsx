import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import axios from 'axios';
import tweet from 'testUtilities/tweet';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import Routes from './index';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.get.mockResolvedValue({ data: { tweet } });

describe('Routes', () => {
  afterEach(jest.clearAllMocks);
  afterAll(jest.restoreAllMocks);
  it('unknown urls show 404 page', async () => {
    expect.assertions(2);
    const history = createMemoryHistory();
    history.push('/unknown-route');
    const { getByText } = render(<Routes />, {
      wrapper: ({ children }) => (
        <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
      ),
    });

    const h1Heading = await waitForElement(() => getByText('404'));
    const h2Heading = await waitForElement(() => getByText('Page Not Found'));

    expect(h1Heading).toBeTruthy();
    expect(h2Heading).toBeTruthy();
  });

  const routes = [
    { path: '/create/tweet', text: 'Tweet' },
    { path: '/update/tweet/tweetId', text: 'Tweet' },
    { path: '/reply/replyId', text: 'Tweet' },
    { path: '/retweet/retweetId', text: 'Tweet' },
    { path: '/log-in', text: 'Log In' },
    { path: '/sign-up', text: 'Sign Up' },
  ];
  it.each(routes)('should render routes', async ({ path, text }) => {
    expect.assertions(1);
    const history = createMemoryHistory();
    history.push(path, { tweetForm: {} });
    const { queryByText } = render(<Routes />, {
      wrapper: ({ children }) => (
        <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
      ),
    });
    await expect(waitForElement(() => queryByText(text))).toBeTruthy();
  });
});
