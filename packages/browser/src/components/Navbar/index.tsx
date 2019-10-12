import React, { FC, memo } from 'react';
import { NavbarWrapper, NavIcon, Container, ThemeButton } from './styled';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Logo from 'components/Logo';
import StyledButton from 'styled/Button';
import SearchBar from 'components/SearchBar';
import Avatar from 'components/Avatar/index';
import AuthState from 'types/AuthState';

interface NavbarProps {
  authState: AuthState;
  resetAuthState: () => void;
  openModal: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  theme: 'light' | 'dark';
}
export const Navbar: FC<NavbarProps> = ({
  toggleTheme,
  authState,
  theme,
  resetAuthState,
  openModal,
  toggleSidebar,
}) => {
  const { user, token, isAuth } = authState;
  return (
    <NavbarWrapper>
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
            <Avatar />
            <StyledButton buttonType={'primary'} onClick={openModal}>
              Tweet
            </StyledButton>
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
    </NavbarWrapper>
  );
};

export default observer(Navbar);
