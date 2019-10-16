import React, { FC, useState, Suspense, lazy } from 'react';
import { NavbarWrapper, NavIcon, Container, ThemeButton } from './styled';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Logo from 'components/Logo';
import StyledButton from 'styled/Button';
import SearchBar from 'components/SearchBar';
import Avatar from 'components/Avatar';
import AuthState from 'types/AuthState';
import Loader from 'components/Loader';

const Portal = lazy(() => import('components/Portal'));
const Sidebar = lazy(() => import('components/Sidebar'));

interface NavbarProps {
  authState: AuthState;
  resetAuthState: () => void;
  openModal: () => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}
export const Navbar: FC<NavbarProps> = ({
  toggleTheme,
  authState,
  theme,
  resetAuthState,
  openModal,
}) => {
  const { user } = authState;
  const [isActive, setIsActive] = useState<boolean>(false);
  const toggleSidebar = () => setIsActive(!isActive);
  return (
    <>
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
          {user ? (
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
      {isActive ? (
        <Suspense fallback={<Loader />}>
          <Portal
            portalId={'sidebar'}
            children={
              <Sidebar
                toggleSidebar={toggleSidebar}
                theme={theme}
                isActive={isActive}
                resetAuthState={() => resetAuthState()}
                toggleTheme={() => toggleTheme()}
                authState={authState}
              />
            }
          ></Portal>
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};

export default observer(Navbar);
