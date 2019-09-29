import React, { FC, useContext } from 'react';
import {
  StyledNavbar,
  NavIcon,
  Container,
  ThemeButton,
} from './StyledNavbar';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Logo from 'components/Logo/Logo';
import StyledButton from 'styled/Button';
import SearchBar from 'components/SearchBar/SearchBar';
import Avatar from 'styled/Avatar';
import AuthState from 'types/AuthState';

interface NavbarProps {
  authState: AuthState;
  resetAuthState: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
}
export const Navbar: FC<NavbarProps> = ({
  toggleTheme,
  authState,
  theme,
  resetAuthState,
  toggleSidebar,
}) => {
  const { user, token, isAuth } = authState;
  return (
    <StyledNavbar>
      <Link to="/">
        <Logo />
      </Link>
      <NavIcon onClick={toggleSidebar} data-testid="mobile-nav-button">
        <FontAwesomeIcon icon="bars" />
      </NavIcon>
      <Container>
        <ThemeButton onClick={toggleTheme}>
          {theme === 'light' ? 'Dark mode' : 'Light mode'}
        </ThemeButton>
        <SearchBar />
        {isAuth ? (
          <>
            <Avatar>
              {isAuth ? (
                <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" />
              ) : (
                <FontAwesomeIcon icon="user" />
              )}
            </Avatar>
            <StyledButton buttonType={'secondary'} onClick={resetAuthState}>
              Log Out
            </StyledButton>
          </>
        ) : (
          <>
            {' '}
            <Link to="/log-in">
              {' '}
              <StyledButton buttonType={'primary'}>Log In</StyledButton>
            </Link>
            <Link to="/sign-up">
              {' '}
              <StyledButton buttonType={'secondary'}>Sign Up</StyledButton>
            </Link>
          </>
        )}
      </Container>
    </StyledNavbar>
  );
};

export default observer(Navbar);
