import React from 'react';
import { render, wait } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TestWrapper from 'testUtilities/TestWrapper';
import useStores from 'hooks/useStores';
import EmailConfirmation from '.';

jest.mock('axios');

jest.mock('hooks/useStores');

const setNotification = jest.fn();
const useStoresMock = useStores as jest.Mocked<any>;
useStoresMock.mockReturnValue({
  notificationStore: {
    setNotification,
  },
});
const axiosMock = axios as jest.Mocked<typeof axios>;
axiosMock.patch.mockReturnValueOnce(Promise.resolve({ data: {}, status: 200 }));
describe('EmailConfirmation', () => {
  afterAll(() => jest.restoreAllMocks());
  it('renders', async () => {
    expect.assertions(4);

    const { getByText } = render(<EmailConfirmation />, {
      wrapper: ({ children }) => <TestWrapper>{children}</TestWrapper>,
    });
    const confirmationButton = getByText('Confirm Email');

    UserEvent.click(confirmationButton);

    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
      expect(axios.patch).toHaveBeenCalledWith(
        'http://localhost:8090/users/user/undefined/confirm',
      );

      expect(setNotification).toHaveBeenCalledTimes(1);
      expect(setNotification).toHaveBeenLastCalledWith({
        type: 'message',
        content: 'You have confirmed you email successfully.',
      });
    });
  });
});
