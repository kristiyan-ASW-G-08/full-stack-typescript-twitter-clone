import React from 'react';
import { render, wait } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryHistory } from 'history';
import { defaultAuthState } from 'stores/AuthStore';
import RouterTestWrapper from 'testUtilities/RouterTestWrapper';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import useStores from 'hooks/useStores';
import Navbar from '.';

const history = createMemoryHistory();

jest.spyOn(history, 'push');

jest.mock('hooks/useStores');

const useStoresMock = useStores as jest.Mocked<any>;

describe('Navbar', () => {
  afterEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());
  const toggleTheme = jest.fn();
  const resetAuthState = jest.fn();
  it('render Navbar:logged out', async () => {
    expect.assertions(9);
    useStoresMock.mockReturnValue({
      themeStore: {
        toggleTheme,
        theme: 'light',
      },

      authStore: {
        resetAuthState,
        authState: defaultAuthState,
      },
    });
    const { container, queryByText } = render(<Navbar />, {
      wrapper: ({ children }) => (
        <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
      ),
    });
    const themeButton = queryByText('Dark mode');
    const logInButton = queryByText('Log In');
    const signUpButton = queryByText('Sign Up');
    const logOutButton = queryByText('Log Out');

    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(logInButton).toBeTruthy();
    expect(logOutButton).toBeFalsy();

    // @ts-ignore
    userEvent.click(themeButton);

    // @ts-ignore
    userEvent.click(signUpButton);

    // @ts-ignore
    userEvent.click(logInButton);

    await wait(() => {
      expect(history.push).toHaveBeenCalledTimes(2);
      expect(history.push).toHaveBeenNthCalledWith(1, '/sign-up');
      expect(history.push).toHaveBeenNthCalledWith(2, '/log-in');
    });

    expect(signUpButton).toBeTruthy();
    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });

  it('render Navbar:logged in', () => {
    // expect.assertions(8);
    useStoresMock.mockReturnValue({
      themeStore: {
        toggleTheme,
        theme: 'light',
      },
      authStore: {
        resetAuthState,
        authState: authenticatedAuthState,
      },
    });
    const { container, queryByText } = render(<Navbar />, {
      wrapper: ({ children }) => (
        <RouterTestWrapper history={history}>{children}</RouterTestWrapper>
      ),
    });
    const themeButton = queryByText('Dark mode');
    const logInButton = queryByText('Log In');
    const signUpButton = queryByText('Sign Up');
    const logOutButton = queryByText('Log Out');

    // @ts-ignore
    userEvent.click(themeButton);

    expect(container).toBeTruthy();
    expect(themeButton).toBeTruthy();
    expect(logInButton).toBeFalsy();
    expect(logOutButton).toBeTruthy();
    expect(signUpButton).toBeFalsy();
    expect(toggleTheme).toHaveBeenCalledTimes(1);

    expect(logOutButton).toBeTruthy();

    // @ts-ignore
    userEvent.click(logOutButton);

    expect(resetAuthState).toHaveBeenCalledTimes(1);
  });
});
