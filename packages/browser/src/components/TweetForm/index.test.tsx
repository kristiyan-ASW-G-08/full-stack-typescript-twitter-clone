import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TweetForm from './index';
import TestWrapper from 'testUtilities/TestWrapper';

jest.mock('axios');
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.post.mockResolvedValue({ data: {}, status: 200 });

describe('TweetForm', () => {
  const token = 'mockToken';
  const resetModalState = jest.fn();
  const setNotification = jest.fn();
  it('render TweetForm', async () => {
    expect.assertions(3);

    const { container, getByText, getByPlaceholderText } = render(
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
    const textInput = await waitForElement(() => getByPlaceholderText('Text'));

    UserEvent.type(textInput, 'newText');
    UserEvent.click(submitButton);

    expect(container).toBeTruthy();
    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
    await wait(() => {
      expect(resetModalState).toHaveBeenCalledTimes(1);
    });
  });
});
