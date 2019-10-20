import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TweetForm from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockResolvedValue({ data: {}, status: 200 });
axiosMock.patch.mockResolvedValue({ data: {}, status: 200 });

describe('TweetForm', () => {
  const token = 'mockToken';
  const resetModalState = jest.fn();
  const setNotification = jest.fn();
  const text = 'text';
  const link = 'https://testing-library.com/';
  afterEach(() => jest.resetAllMocks());
  it('render TweetForm (post a new Tweet)', async () => {
    expect.assertions(4);

    const { getByText, getByPlaceholderText, getByTestId } = render(
      <TweetForm
        tweetFormProps={{}}
        resetModalState={resetModalState}
        setNotification={setNotification}
        token={token}
      />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const submitButton = await waitForElement(() => getByText('Tweet'));
    const linkButton = await waitForElement(() => getByTestId('link-button'));

    userEvent.click(linkButton);

    const textInput = await waitForElement(() => getByPlaceholderText('Text'));
    const linkInput = await waitForElement(() => getByPlaceholderText('Link'));

    UserEvent.type(textInput, text);
    UserEvent.type(linkInput, link);

    expect(textInput.textContent).toMatch(text);
    expect(linkInput).toHaveAttribute('value', link);

    UserEvent.click(submitButton);

    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    await wait(() => {
      expect(resetModalState).toHaveBeenCalledTimes(1);
    });
  });
  it('render TweetForm (edit a Tweet)', async () => {
    expect.assertions(6);
    const { getByText, getByPlaceholderText } = render(
      <TweetForm
        tweetFormProps={{ tweet, type: tweet.type }}
        resetModalState={resetModalState}
        setNotification={setNotification}
        token={token}
      />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const submitButton = await waitForElement(() => getByText('Tweet'));
    const textInput = await waitForElement(() => getByPlaceholderText('Text'));
    const linkInput = await waitForElement(() => getByPlaceholderText('Link'));

    expect(textInput.textContent).toMatch(tweet.text);
    expect(linkInput).toHaveAttribute('value', tweet.link);

    UserEvent.type(textInput, text);
    UserEvent.type(linkInput, link);

    expect(textInput.textContent).toMatch(text);
    expect(linkInput).toHaveAttribute('value', link);

    UserEvent.click(submitButton);

    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
    });
    await wait(() => {
      expect(resetModalState).toHaveBeenCalledTimes(1);
    });
  });
});
