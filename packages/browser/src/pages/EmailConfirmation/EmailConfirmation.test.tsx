import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import TestWrapper from 'testUtilities/TestWrapper';
import EmailConfirmation from './EmailConfirmation';


jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.patch.mockReturnValueOnce(
  Promise.resolve({ data: {}, status: 200 }),
);
describe('EmailConfirmation', () => {
  it('renders', async () => {
    expect.assertions(3);

    const { container, getByText, getByPlaceholderText } = render(
      <EmailConfirmation />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    expect(container).toBeTruthy();

    const confirmationButton = await waitForElement(() =>
      getByText('Confirm Email'),
    );
    expect(confirmationButton).toBeTruthy();

    UserEvent.click(confirmationButton);
    await wait(() => {
      expect(axios.patch).toHaveBeenCalledTimes(1);
    });
  });
});
