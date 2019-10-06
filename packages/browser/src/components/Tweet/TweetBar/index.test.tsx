import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TweetBar from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
import authState from 'testUtilities/authenticatedAuthState';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.patch.mockReturnValueOnce(
  Promise.resolve({ data: {}, status: 200 }),
);

describe('TweetBar', () => {
  const updateUser = jest.fn();
  const setNotification = jest.fn();
  it('render TweetBar', async () => {
    expect.assertions(5);
    const { rerender, getByTestId } = render(
      <TweetBar
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const likeButton = await waitForElement(() => getByTestId('heart-button'));
    const bookmarkButton = await waitForElement(() =>
      getByTestId('bookmark-button'),
    );

    UserEvent.click(likeButton);
    UserEvent.click(bookmarkButton);

    expect(likeButton).toBeTruthy();
    expect(bookmarkButton).toBeTruthy();
    expect(setNotification).toHaveBeenCalledTimes(2);

    rerender(
      <TweetBar
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );

    UserEvent.click(likeButton);

    UserEvent.click(bookmarkButton);

    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(2);
    });
    expect(updateUser).toHaveBeenCalledTimes(4);
  });
});
