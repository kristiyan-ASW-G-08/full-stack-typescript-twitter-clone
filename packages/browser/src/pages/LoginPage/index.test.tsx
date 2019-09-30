import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import LoginPage from '.';
import TestWrapper from 'testUtilities/TestWrapper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockReturnValueOnce(
  Promise.resolve({ data: {}, status: 200 }),
);
describe('LoginPage', () => {
  const email = 'testmail@test.test';
  const password = 'passwordpassword';


  it('it renders', async () => {
    expect.assertions(5);

    const { container, getByText, getByPlaceholderText } = render(
      <LoginPage />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );

    expect(container).toBeTruthy();

    const emailInput = await waitForElement(() =>
      getByPlaceholderText('Email address'),
    );
    const passwordInput = await waitForElement(() =>
      getByPlaceholderText('Password'),
    );
    const submitButton = await waitForElement(() => getByText('Log In'));

    UserEvent.type(emailInput, email);
    UserEvent.type(passwordInput, password);
    UserEvent.click(submitButton);

    UserEvent.click(submitButton);
    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });

    expect(emailInput).toHaveAttribute('value', email);
    expect(passwordInput).toHaveAttribute('value', password);

    expect(submitButton).toBeTruthy();
  });
});
