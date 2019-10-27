import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import tweet from 'testUtilities/tweet';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import { createMemoryHistory } from 'history';
import TweetBar from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.patch.mockReturnValueOnce(
  Promise.resolve({ data: {}, status: 200 }),
);
mockedAxios.delete.mockResolvedValue({ data: {}, status: 204 });

const history = createMemoryHistory();

const historyPushSpy = jest.spyOn(history, 'push');
describe('TweetBar', () => {
  const updateUser = jest.fn();
  const setNotification = jest.fn();
  const deleteTweetHandler = jest.fn();
  const notification = {
    type: 'warning',
    content: 'Log in or Sign up to perform this action!',
  };

  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());
  it('render TweetBar (bookmark button)', async () => {
    expect.assertions(4);
    const { rerender, getByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const bookmarkButton = getByTestId('bookmark-button');
    UserEvent.click(bookmarkButton);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(notification);

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );

    UserEvent.click(bookmarkButton);
    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
    });
    expect(updateUser).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (like button)', async () => {
    expect.assertions(4);
    const { rerender, getByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const likeButton = getByTestId('heart-button');
    UserEvent.click(likeButton);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(notification);

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );

    UserEvent.click(likeButton);
    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
    });
    expect(updateUser).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (retweet button)', async () => {
    expect.assertions(3);
    const { rerender, getByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const retweetButton = getByTestId('retweet-button');
    UserEvent.click(retweetButton);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(notification);

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );

    UserEvent.click(retweetButton);

    expect(historyPushSpy).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (reply button)', async () => {
    expect.assertions(3);
    const { rerender, getByTestId, queryByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    let replyButton = queryByTestId('reply-button');

    expect(replyButton).toBeFalsy();

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );
    replyButton = getByTestId('comment-button');

    expect(replyButton).toBeTruthy();

    UserEvent.click(replyButton);

    expect(historyPushSpy).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (edit button)', async () => {
    expect.assertions(3);
    const { rerender, getByTestId, queryByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    let editButton = queryByTestId('edit-button');

    expect(editButton).toBeFalsy();

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );
    editButton = getByTestId('edit-button');

    expect(editButton).toBeTruthy();

    UserEvent.click(editButton);

    expect(historyPushSpy).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (delete button)', async () => {
    expect.assertions(3);
    const { rerender, getByTestId, queryByTestId } = render(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={defaultAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    let deleteButton = queryByTestId('trash-button');

    expect(deleteButton).toBeFalsy();

    rerender(
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        authState={authenticatedAuthState}
        tweet={tweet}
        updateUser={updateUser}
        setNotification={setNotification}
      />,
    );
    deleteButton = getByTestId('trash-button');

    expect(deleteButton).toBeTruthy();

    UserEvent.click(deleteButton);

    await wait(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });
  });
});
