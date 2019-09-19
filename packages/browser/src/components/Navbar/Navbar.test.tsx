import React from 'react';
import { render, fireEvent, waitForElement } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Navbar from './Navbar';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
import Theme from 'components/Theme/Theme';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faUser, faSearch);
describe('Navbar', () => {
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
  it('render unauthenticated Navbar', async () => {
    const { container, getByText, rerender } = render(
      <Theme currentTheme={theme}>
        <Navbar
          authState={defaultAuthState}
          resetAuthState={resetAuthState}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      </Theme>,
    );
    const themeButton = await waitForElement(() => getByText('Dark mode'));
    const logInButton = await waitForElement(() => getByText('Log In'));
    const signUpButton = await waitForElement(() => getByText('Sign Up'));
    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(logInButton).toBeTruthy();
    expect(signUpButton).toBeTruthy();

    fireEvent.click(themeButton);
    expect(toggleTheme).toHaveBeenCalledTimes(1);
    rerender(
      <Theme currentTheme={theme}>
        <Navbar
          resetAuthState={resetAuthState}
          authState={authenticatedAuthState}
          theme={'dark'}
          toggleTheme={toggleTheme}
        />
      </Theme>,
    );
    const lightThemeButton = await waitForElement(() =>
      getByText('Light mode'),
    );
    const logOutButton = await waitForElement(() => getByText('Log Out'));
    expect(lightThemeButton).toBeTruthy();
    expect(logOutButton).toBeTruthy();
    fireEvent.click(logOutButton);
    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
  
});
