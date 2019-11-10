import React from 'react';
import { render, wait } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { defaultAuthState } from 'stores/AuthStore';
import userEvent from '@testing-library/user-event';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

import Sidebar from '.';

describe('Sidebar', () => {
  afterAll(() => jest.restoreAllMocks());
  const theme = 'light';
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  const toggleSidebar = jest.fn();
  it('render Sidebar', async () => {
    expect.assertions(18);
    const history = createMemoryHistory();
    jest.spyOn(history, 'push');
    const {
      rerender,
      getByTestId,
      queryByText,
      getByText,
      queryByTestId,
    } = render(
      <Sidebar
        toggleSidebar={toggleSidebar}
        isActive
        authState={defaultAuthState}
        resetAuthState={resetAuthState}
        theme={theme}
        toggleTheme={toggleTheme}
      />,
      {
        wrapper: ({ children }) => (
          <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
        ),
      },
    );
    const themeButton = getByTestId('theme-button');
    let logInButton = queryByText('Log In');
    let signUpButton = queryByText('Sign Up');
    let logOutButton = queryByText('Log Out');
    const backdrop = getByTestId('backdrop');

    userEvent.click(backdrop);
    userEvent.click(themeButton);

    expect(themeButton.textContent).toMatchSnapshot();
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    expect(toggleSidebar).toHaveBeenCalledTimes(1);
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();
    expect(logOutButton).toBeNull();

    // @ts-ignore
    userEvent.click(logInButton);

    // @ts-ignore
    userEvent.click(signUpButton);

    rerender(
      <Sidebar
        toggleSidebar={toggleSidebar}
        isActive
        resetAuthState={resetAuthState}
        authState={authenticatedAuthState}
        theme="light"
        toggleTheme={toggleTheme}
      />,
    );

    const lightThemeButton = getByTestId('theme-button');
    logInButton = queryByText('Log In');
    signUpButton = queryByText('Sign Up');
    logOutButton = getByText('Log Out');
    const profileLink = queryByTestId(`profile-link-sidebar`);

    userEvent.click(logOutButton);

    expect(logInButton).toBeFalsy();
    expect(signUpButton).toBeFalsy();
    expect(logOutButton).toBeTruthy();

    expect(themeButton.textContent).toMatchSnapshot();
    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    expect(resetAuthState).toHaveBeenCalledTimes(1);

    expect(profileLink).toBeTruthy();

    // @ts-ignore
    userEvent.click(profileLink);

    await wait(() => {
      expect(history.push).toHaveBeenCalledTimes(3);
      expect(history.push).toHaveBeenNthCalledWith(1, `/log-in`);
      expect(history.push).toHaveBeenNthCalledWith(2, `/sign-up`);
      expect(history.push).toHaveBeenNthCalledWith(
        3,
        `/users/${authenticatedAuthState.user._id}`,
      );
    });
  });
});
