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
  afterAll(() => jest.restoreAllMocks());
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
  it.each([
    '/create/tweet',
    '/update/tweet/tweetId',
    '/reply/replyId',
    '/retweet/retweetId',
  ])('paths render TweetForm', async path => {
    expect.assertions(1);
    const history = createMemoryHistory();
    history.push(path, { tweetForm: {} });
    const { getByText } = render(<Routes />, {
      wrapper: ({ children }) => (
        <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
      ),
    });
    const submitButton = await waitForElement(() => getByText('Tweet'));
    expect(submitButton).toBeTruthy();
  });
});
