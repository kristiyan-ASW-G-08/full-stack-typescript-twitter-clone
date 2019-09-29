import React from 'react';
import { render, waitForElement, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import userEvent from '@testing-library/user-event';
import TestWrapper from 'testUtilities/TestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

describe('Sidebar', () => {
  const theme = 'light';
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  const toggleSidebar = jest.fn();
  it('render Sidebar', async () => {
    expect.assertions(11);

    const { container, getByText, rerender } = render(
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
    const themeButton = await waitForElement(() =>
      getByTestId(container, 'theme-button'),
    );
    const logInButton = await waitForElement(() => getByText('Log In'));
    const signUpButton = await waitForElement(() => getByText('Sign Up'));
    const backdrop = await waitForElement(() =>
      getByTestId(container, 'backdrop'),
    );

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
    const lightThemeButton = await waitForElement(() =>
      getByTestId(container, 'theme-button'),
    );
    const logOutButton = await waitForElement(() => getByText('Log Out'));

    UserEvent.click(logOutButton);

    expect(themeButton.textContent).toMatchSnapshot();
    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
