import React, { Context, Provider } from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import FollowButton from './index';
import axios from 'axios';
import TestWrapper from 'testUtilities/TestWrapper';
import user from 'testUtilities/user';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import userEvent from '@testing-library/user-event';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.patch.mockReturnValue(
  Promise.resolve({ data: { data: { user: {} } } }),
);

describe('FollowButton', () => {
  it('render FollowButton', async () => {
    // expect.assertions(3);
    const updateUser = jest.fn();
    const { getByText } = render(
      <FollowButton
        updateUser={updateUser}
        authState={authenticatedAuthState}
        currentUser={user}
      />,

      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    const followButton = await waitForElement(() => getByText('Follow'));
    expect(followButton).toBeTruthy();
    userEvent.click(followButton);
    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
    });
    expect(updateUser).toHaveBeenCalledTimes(1);
  });
});
