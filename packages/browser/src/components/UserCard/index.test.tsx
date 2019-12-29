import React from 'react';
import { render, wait } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import user from 'testUtilities/user';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import { defaultAuthState } from 'stores/AuthStore';
import UserCard from '.';

describe('UserCard', () => {
  afterEach(jest.clearAllMocks);
  afterAll(() => jest.restoreAllMocks());
  it('render UserCard: default authState', async () => {
    expect.assertions(1);
    const updateUser = jest.fn();
    const history = createMemoryHistory();
    jest.spyOn(history, 'push');
    const { queryByTestId } = render(
      <UserCard
        updateUser={updateUser}
        authState={defaultAuthState}
        user={user}
      />,
      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );

    const followButton = queryByTestId('follow-button');
    expect(followButton).toBeFalsy();
  });

  it('render UserCard: authenticated authState: same user', async () => {
    expect.assertions(4);
    const updateUser = jest.fn();
    const history = createMemoryHistory();
    jest.spyOn(history, 'push');
    const { queryByText, queryByTestId } = render(
      <UserCard
        updateUser={updateUser}
        authState={authenticatedAuthState}
        user={user}
      />,
      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );

    const editUserLink = queryByText('Edit');
    const profileLink = queryByTestId(`profile-link-usercard`);

    expect(editUserLink).toBeTruthy();
    expect(profileLink).toBeTruthy();

    // @ts-ignore
    UserEvent.click(editUserLink);

    // @ts-ignore
    UserEvent.click(profileLink);

    await wait(() => {
      expect(history.push).toHaveBeenCalledTimes(2);
      expect(history.push).toHaveBeenNthCalledWith(2, `/users/${user._id}`);
    });
  });

  it('render UserCard: authenticated authState: different users', async () => {
    expect.assertions(1);
    const updateUser = jest.fn();
    const history = createMemoryHistory();
    jest.spyOn(history, 'push');
    const newAuthenticatedAuthState = { ...authenticatedAuthState };
    newAuthenticatedAuthState.user._id = 'diffrentId';
    const { queryByText } = render(
      <UserCard
        updateUser={updateUser}
        authState={newAuthenticatedAuthState}
        user={user}
      />,
      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );

    const editUserLink = queryByText('Edit');
    expect(editUserLink).toBeFalsy();
  });
});
