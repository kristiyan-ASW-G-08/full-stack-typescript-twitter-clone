import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TweetBar from './index';
import TestWrapper from 'testUtilities/TestWrapper';
import tweet from 'testUtilities/tweet';
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
  const setModalState = jest.fn();
  const deleteTweetHandle = jest.fn();
  it('render TweetBar', async () => {
    // expect.assertions(6);
    const { rerender, getByTestId, queryByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandle}
        setModalState={setModalState}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const likeButton = getByTestId('heart-button');
    const replyButton = getByTestId('comment-button');
    const retweetButton = getByTestId('retweet-button');
    const bookmarkButton = getByTestId('bookmark-button');
    const deleteButton = queryByTestId('trash-button');
    const editButtonButton = queryByTestId('editButton-button');

    UserEvent.click(likeButton);
    UserEvent.click(bookmarkButton);
    UserEvent.click(replyButton);
    UserEvent.click(retweetButton);

    expect(deleteButton).toBeFalsy();
    expect(editButtonButton).toBeFalsy();
    expect(setNotification).toHaveBeenCalledTimes(4);

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandle}
        setModalState={setModalState}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );

    UserEvent.click(likeButton);
    UserEvent.click(bookmarkButton);
    UserEvent.click(replyButton);
    UserEvent.click(retweetButton);

    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(2);
    });
    expect(setModalState).toHaveBeenCalledTimes(2);
    expect(updateUser).toHaveBeenCalledTimes(2);
  });
});
