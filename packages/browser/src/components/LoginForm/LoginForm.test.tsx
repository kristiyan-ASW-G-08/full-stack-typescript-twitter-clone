import React from 'react';
import { render, waitForElement, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import axios from 'axios';
import LoginForm from './LoginForm';
import TestWrapper from 'testUtilities/TestWrapper';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockReturnValueOnce(
  Promise.resolve({ data: {}, status: 200 }),
);
describe('LoginForm', () => {
  const email = 'testmail@test.test';
  const password = 'passwordpassword';
  const theme = 'light';

  it('it renders', async () => {
    expect.assertions(5);

    const { container, getByText, getByPlaceholderText } = render(
      <LoginForm />,
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

    UserEvent.type(emailInput, email);
    UserEvent.type(passwordInput, password);

    expect(emailInput).toHaveAttribute('value', email);
    expect(passwordInput).toHaveAttribute('value', password);

    const submitButton = await waitForElement(() => getByText('Log In'));
    expect(submitButton).toBeTruthy();

    UserEvent.click(submitButton);
    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
