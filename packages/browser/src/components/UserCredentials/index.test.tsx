import React from 'react';
import { render, wait } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import UserCredentials from '.';

describe('UserCredentials', () => {
  afterAll(() => jest.restoreAllMocks());
  it('render UserCredentials', async () => {
    expect.assertions(3);
    const history = createMemoryHistory();
    const username = 'TestUser';
    const handle = 'TestHandle';
    const followers = 100;
    const following = 300;
    const _id = 'testId';
    jest.spyOn(history, 'push');
    const { getByTestId } = render(
      <UserCredentials
        username={username}
        handle={handle}
        followers={followers}
        following={following}
        _id={_id}
      />,
      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const followersLink = getByTestId('followers-link');
    const followingLink = getByTestId('following-link');

    UserEvent.click(followersLink);
    UserEvent.click(followingLink);

    await wait(() => {
      expect(history.push).toHaveBeenCalledTimes(2);
      expect(history.push).toHaveBeenNthCalledWith(
        1,
        '/users/testId/followers',
      );
      expect(history.push).toHaveBeenNthCalledWith(
        2,
        '/users/testId/following',
      );
    });
  });
});
