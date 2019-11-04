import React, { FC, useState, Suspense, lazy } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import Logo from 'components/Logo';
import StyledButton from 'styled/Button';
import SearchBar from 'components/SearchBar';
import Avatar from 'components/Avatar';
import AuthState from 'types/AuthState';
import Loader from 'components/Loader';
import { SidebarButton } from 'components/Sidebar/styled';
import {
  NavbarWrapper,
  NavIcon,
  Container,
  ThemeButton,
  AvatarWrapper,
  DropDown,
  DropDownWrapper,
} from './styled';

const Portal = lazy(() => import('components/Portal'));
const Sidebar = lazy(() => import('components/Sidebar'));

interface NavbarProps {
  authState: AuthState;
  resetAuthState: () => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
}
export const Navbar: FC<NavbarProps> = ({
  toggleTheme,
  authState,
  theme,
  resetAuthState,
}) => {
  const { user } = authState;
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMenuActive, setIsMenuActive] = useState<boolean>(false);
  const location = useLocation();
  const toggleSidebar = () => setIsActive(!isActive);
  const toggleMenu = () => setIsMenuActive(!isMenuActive);
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
              <DropDownWrapper>
                <AvatarWrapper onClick={toggleMenu}>
                  <Avatar avatarURL={user.avatar} />
                </AvatarWrapper>
                {isMenuActive ? (
                  <DropDown>
                    <li>
                      <Link to="/" onClick={toggleMenu}>
                        <SidebarButton>
                          <span>
                            <FontAwesomeIcon icon="home" />
                          </span>
                          <p>Home</p>
                        </SidebarButton>
                      </Link>
                    </li>
                    <li>
                      <Link to={`/users/${user._id}`} onClick={toggleMenu}>
                        <SidebarButton>
                          <span>
                            <FontAwesomeIcon icon="user" />
                          </span>
                          <p>Profile</p>
                        </SidebarButton>
                      </Link>
                    </li>
                  </DropDown>
                ) : (
                  ''
                )}
              </DropDownWrapper>

              <StyledButton buttonType="primary">
                <Link
                  to={{
                    pathname: `/create/tweet`,
                    state: { tweetForm: location },
                  }}
                >
                  {' '}
                  Tweet
                </Link>
              </StyledButton>
              <StyledButton buttonType="secondary" onClick={resetAuthState}>
                Log Out
              </StyledButton>
            </>
          ) : (
            <>
              {' '}
              <Link to="/log-in">
                {' '}
                <StyledButton buttonType="primary">Log In</StyledButton>
              </Link>
              <Link to="/sign-up">
                {' '}
                <StyledButton buttonType="secondary">Sign Up</StyledButton>
              </Link>
            </>
          )}
        </Container>
      </NavbarWrapper>
      {isActive ? (
        <Suspense fallback={<Loader />}>
          <Portal portalId="sidebar">
            <Sidebar
              toggleSidebar={toggleSidebar}
              theme={theme}
              isActive={isActive}
              resetAuthState={() => resetAuthState()}
              toggleTheme={() => toggleTheme()}
              authState={authState}
            />
          </Portal>
        </Suspense>
      ) : (
        ''
      )}
    </>
  );
};

export default observer(Navbar);
