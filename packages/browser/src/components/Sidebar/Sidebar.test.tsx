import React from 'react';
import { render, waitForElement, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import Theme from 'components/Theme/Theme';
describe('Sidebar', () => {
  const theme = 'light';
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  const authenticatedAuthState = {
    isAuth: true,
    user: {
      username: 'mockUserName',
      handle: 'mockUserHandle',
      email: 'mockUserEmail@mail.com',
      profilePhoto: 'default',
      headerPhoto: 'default',
      date: 'mockDate',
      website: 'mockWebsite',
      followers: 0,
      following: [],
      likes: [],
      bookmarks: [],
    },
    token: 'mockToken',
  };
  it('render unauthenticated Sidebar', async () => {
    const { container, getByText, rerender } = render(
      <Theme theme={theme}>
        <Sidebar
          on={true}
          authState={defaultAuthState}
          resetAuthState={resetAuthState}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </Theme>,
    );
    const themeButton = await waitForElement(() =>
      getByTestId(container, 'theme-button'),
    );
    const logInButton = await waitForElement(() => getByText('Log In'));
    const signUpButton = await waitForElement(() => getByText('Sign Up'));
    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(themeButton.textContent).toMatchSnapshot();
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();

    UserEvent.click(themeButton);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    rerender(
      <Theme theme={theme}>
        <Sidebar
          on={true}
          resetAuthState={resetAuthState}
          authState={authenticatedAuthState}
          theme={'light'}
          toggleTheme={toggleTheme}
        />
      </Theme>,
    );
    const lightThemeButton = await waitForElement(() =>
      getByTestId(container, 'theme-button'),
    );
    expect(themeButton.textContent).toMatchSnapshot();
    const logOutButton = await waitForElement(() => getByText('Log Out'));
    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    UserEvent.click(logOutButton);
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
