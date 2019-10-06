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
  const toggleSidebar = jest.fn();
  const openModal = jest.fn();
  it('render Navbar', async () => {
    expect.assertions(10);

    const { container, getByText, getByTestId, rerender } = render(
      <Navbar
        openModal={openModal}
        toggleSidebar={toggleSidebar}
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
    const mobileNavButton = await waitForElement(() =>
      getByTestId('mobile-nav-button'),
    );

    UserEvent.click(mobileNavButton);
    UserEvent.click(themeButton);

    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(mobileNavButton).toBeTruthy();
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
    expect(toggleTheme).toHaveBeenCalledTimes(1);

    rerender(
      <Navbar
        openModal={openModal}
        toggleSidebar={toggleSidebar}
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
