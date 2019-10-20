import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import Sidebar from '.';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import userEvent from '@testing-library/user-event';
import TestWrapper from 'testUtilities/TestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

describe('Sidebar', () => {
  const theme = 'light';
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  const toggleSidebar = jest.fn();
  it('render Sidebar', () => {
    expect.assertions(11);

    const { container, getByText, getByTestId, rerender } = render(
      <Sidebar
        toggleSidebar={toggleSidebar}
        isActive={true}
        authState={defaultAuthState}
        resetAuthState={resetAuthState}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
      {
        wrapper: ({ children }) => <TestWrapper children={children} />,
      },
    );
    const themeButton = getByTestId('theme-button');
    const logInButton = getByText('Log In');
    const signUpButton = getByText('Sign Up');
    const backdrop = getByTestId('backdrop');

    userEvent.click(backdrop);
    UserEvent.click(themeButton);

    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(themeButton.textContent).toMatchSnapshot();
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    expect(toggleSidebar).toHaveBeenCalledTimes(1);

    rerender(
      <Sidebar
        toggleSidebar={toggleSidebar}
        isActive={true}
        resetAuthState={resetAuthState}
        authState={authenticatedAuthState}
        theme={'light'}
        toggleTheme={toggleTheme}
      />,
    );

    const lightThemeButton = getByTestId('theme-button');
    const logOutButton = getByText('Log Out');

    UserEvent.click(logOutButton);

    expect(themeButton.textContent).toMatchSnapshot();
    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
