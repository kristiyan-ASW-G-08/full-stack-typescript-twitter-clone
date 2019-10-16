import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import Navbar from '.';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import TestWrapper from 'testUtilities/TestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

describe('Navbar', () => {
  const theme = 'light';
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  const openModal = jest.fn();
  it('render Navbar', async () => {
    expect.assertions(8);

    const { container, getByText, rerender } = render(
      <Navbar
        openModal={openModal}
        authState={defaultAuthState}
        resetAuthState={resetAuthState}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const themeButton = await waitForElement(() => getByText('Dark mode'));
    const logInButton = await waitForElement(() => getByText('Log In'));
    const signUpButton = await waitForElement(() => getByText('Sign Up'));

    UserEvent.click(themeButton);

    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(toggleTheme).toHaveBeenCalledTimes(1);

    rerender(
      <Navbar
        openModal={openModal}
        resetAuthState={resetAuthState}
        authState={authenticatedAuthState}
        theme={'dark'}
        toggleTheme={toggleTheme}
      />,
    );
    const lightThemeButton = await waitForElement(() =>
      getByText('Light mode'),
    );
    const logOutButton = await waitForElement(() => getByText('Log Out'));

    UserEvent.click(logOutButton);

    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
