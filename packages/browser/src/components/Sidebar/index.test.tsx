import React from 'react';
import { render } from '@testing-library/react';
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
    expect.assertions(13);

    const { rerender, getByTestId, queryByText, getByText } = render(
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
    let logInButton = queryByText('Log In');
    let signUpButton = queryByText('Sign Up');
    let logOutButton = queryByText('Log Out');
    const backdrop = getByTestId('backdrop');

    userEvent.click(backdrop);
    UserEvent.click(themeButton);

    expect(themeButton.textContent).toMatchSnapshot();
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(logOutButton).toBeNull();

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
    logInButton = queryByText('Log In');
    signUpButton = queryByText('Sign Up');
    logOutButton = getByText('Log Out');

    UserEvent.click(logOutButton);

    expect(logInButton).toBeFalsy();
    expect(signUpButton).toBeFalsy();
    expect(logOutButton).toBeTruthy();

    expect(themeButton.textContent).toMatchSnapshot();
    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
