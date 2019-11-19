import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import tweet from 'testUtilities/tweet';
import { defaultAuthState } from 'stores/AuthStore';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import { createMemoryHistory } from 'history';
import user from 'testUtilities/user';
import useStores from 'hooks/useStores';
import TweetBar from '.';

jest.mock('axios');
jest.mock('hooks/useStores');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.patch.mockResolvedValue({ data: { data: { user } }, status: 200 });
mockedAxios.delete.mockResolvedValue({ data: {}, status: 204 });

const setNotification = jest.fn();
const updateUser = jest.fn();
const useStoresMock = useStores as jest.Mocked<any>;
useStoresMock.mockReturnValue({
  notificationStore: {
    setNotification,
  },
  authStore: {
    authState: defaultAuthState,
    updateUser,
  },
});

const history = createMemoryHistory();

const historyPushSpy = jest.spyOn(history, 'push');

describe('TweetBar', () => {
  afterEach(() => jest.clearAllMocks());
  afterAll(() => jest.restoreAllMocks());

  const deleteTweetHandler = jest.fn();
  const notification = {
    type: 'warning',
    content: 'Log in or Sign up to perform this action!',
  };

  it('render TweetBar (bookmark button)', async () => {
    expect.assertions(4);
    const { rerender, getByTestId } = render(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,

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

    useStoresMock.mockReturnValueOnce({
      notificationStore: {
        setNotification,
      },
      authStore: {
        authState: authenticatedAuthState,
        updateUser,
      },
    });

    rerender(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,
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
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const likeButton = getByTestId('like-button');
    UserEvent.click(likeButton);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(notification);

    useStoresMock.mockReturnValueOnce({
      notificationStore: {
        setNotification,
      },
      authStore: {
        authState: authenticatedAuthState,
        updateUser,
      },
    });
    rerender(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,
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
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,

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
    useStoresMock.mockReturnValueOnce({
      notificationStore: {
        setNotification,
      },
      authStore: {
        authState: authenticatedAuthState,
        updateUser,
      },
    });
    rerender(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,
    );

    UserEvent.click(retweetButton);

    expect(historyPushSpy).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (reply button)', async () => {
    expect.assertions(4);
    const { rerender, getByTestId } = render(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const replyButton = getByTestId('reply-button');

    UserEvent.click(replyButton);

    expect(setNotification).toHaveBeenCalledTimes(1);
    expect(setNotification).toHaveBeenCalledWith(notification);
    useStoresMock.mockReturnValueOnce({
      notificationStore: {
        setNotification,
      },
      authStore: {
        authState: authenticatedAuthState,
        updateUser,
      },
    });
    rerender(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,
    );

    expect(replyButton).toBeTruthy();

    UserEvent.click(replyButton);

    expect(historyPushSpy).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (edit button)', async () => {
    expect.assertions(3);
    const { rerender, getByTestId, queryByTestId } = render(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    let editButton = queryByTestId('edit-button');

    expect(editButton).toBeFalsy();
    useStoresMock.mockReturnValueOnce({
      notificationStore: {
        setNotification,
      },
      authStore: {
        authState: authenticatedAuthState,
        updateUser,
      },
    });
    rerender(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,
    );
    editButton = getByTestId('edit-button');

    expect(editButton).toBeTruthy();

    UserEvent.click(editButton);

    expect(historyPushSpy).toHaveBeenCalledTimes(1);
  });
  it('render TweetBar (delete button)', async () => {
    expect.assertions(3);
    const { rerender, getByTestId, queryByTestId } = render(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,

      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    let deleteButton = queryByTestId('delete-button');

    expect(deleteButton).toBeFalsy();
    useStoresMock.mockReturnValueOnce({
      notificationStore: {
        setNotification,
      },
      authStore: {
        authState: authenticatedAuthState,
        updateUser,
      },
    });
    rerender(
      <TweetBar deleteTweetHandler={deleteTweetHandler} tweet={tweet} />,
    );
    deleteButton = getByTestId('delete-button');

    expect(deleteButton).toBeTruthy();

    UserEvent.click(deleteButton);

    await wait(() => {
      expect(axios.delete).toHaveBeenCalledTimes(1);
    });
  });
});
