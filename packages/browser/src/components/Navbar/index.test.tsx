import React from 'react';
import { render } from '@testing-library/react';
import UserEvent from '@testing-library/user-event';
import Navbar from '.';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import TestWrapper from 'testUtilities/TestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

describe('Navbar', () => {
  const theme = 'light';
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  it('render Navbar', () => {
    expect.assertions(8);

    const { container, getByText, rerender } = render(
      <Navbar
        authState={defaultAuthState}
        resetAuthState={resetAuthState}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const themeButton = getByText('Dark mode');
    const logInButton = getByText('Log In');
    const signUpButton = getByText('Sign Up');

    UserEvent.click(themeButton);

    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(toggleTheme).toHaveBeenCalledTimes(1);

    rerender(
      <Navbar
        resetAuthState={resetAuthState}
        authState={authenticatedAuthState}
        theme={'dark'}
        toggleTheme={toggleTheme}
      />,
    );
    const lightThemeButton = getByText('Light mode');

    const logOutButton = getByText('Log Out');

    UserEvent.click(logOutButton);

    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
