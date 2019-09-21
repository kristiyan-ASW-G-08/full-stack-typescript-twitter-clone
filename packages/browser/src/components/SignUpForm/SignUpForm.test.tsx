import React from 'react';
import {
  render,
  fireEvent,
  waitForElement,
  wait,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import SignUpForm from './SignUpForm';
import Theme from 'components/Theme/Theme';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.post.mockReturnValueOnce(
  Promise.resolve({ data: {}, status: 200 }),
);
describe('SignUpForm', () => {
  const username = 'newUsername';
  const handle = 'newHandle';
  const email = 'testmail@test.test';
  const password = 'passwordpassword';
  const confirmPassword = 'passwordpassword';
  const theme = 'light';

  it('it renders', async () => {
    const { container, getByText, rerender, getByPlaceholderText } = render(
      <BrowserRouter>
        <Theme currentTheme={theme}>
          <SignUpForm />
        </Theme>
      </BrowserRouter>,
    );

    expect(container).toBeTruthy();

    const usernameInput = await waitForElement(() =>
      getByPlaceholderText('Username'),
    );
    const handleInput = await waitForElement(() =>
      getByPlaceholderText('Handle'),
    );
    const emailInput = await waitForElement(() =>
      getByPlaceholderText('Email address'),
    );
    const passwordInput = await waitForElement(() =>
      getByPlaceholderText('Password'),
    );
    const confirmPasswordInput = await waitForElement(() =>
      getByPlaceholderText('Repeat Password'),
    );

    UserEvent.type(usernameInput, username);
    UserEvent.type(handleInput, handle);
    UserEvent.type(emailInput, email);
    UserEvent.type(passwordInput, password);
    UserEvent.type(confirmPasswordInput, confirmPassword);

    expect(usernameInput).toHaveAttribute('value', username);
    expect(handleInput).toHaveAttribute('value', handle);
    expect(emailInput).toHaveAttribute('value', email);
    expect(passwordInput).toHaveAttribute('value', password);
    expect(confirmPasswordInput).toHaveAttribute('value', confirmPassword);

    const submitButton = await waitForElement(() => getByText('Sign Up'));
    expect(submitButton).toBeTruthy();

    UserEvent.click(submitButton);
    await wait(() => {
      expect(axios.post).toHaveBeenCalledTimes(1);
    });
  });
});
