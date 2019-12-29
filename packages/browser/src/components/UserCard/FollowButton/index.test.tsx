import React from 'react';
import { render, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import TestWrapper from 'testUtilities/TestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import userEvent from '@testing-library/user-event';
import FollowButton from './index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.patch.mockReturnValue(
  Promise.resolve({ data: { data: { user: {} } } }),
);

describe('FollowButton', () => {
  afterEach(jest.restoreAllMocks);
  it('render FollowButton', async () => {
    expect.assertions(2);
    const { user, token } = authenticatedAuthState;
    const updateUser = jest.fn();
    const setNotification = jest.fn();
    const { getByText } = render(
      <FollowButton
        setNotification={setNotification}
        updateUser={updateUser}
        authenticatedUser={authenticatedAuthState.user}
        token={token}
        currentUser={user}
      />,

      {
        wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
      },
    );

    const followButton = getByText('Follow');

    userEvent.click(followButton);
    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
    });
    expect(updateUser).toHaveBeenCalledTimes(1);
  });
});
