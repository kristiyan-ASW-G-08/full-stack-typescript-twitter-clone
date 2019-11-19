import React, { FC, useState, Suspense, lazy } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useLocation } from 'react-router-dom';
import Logo from 'components/Logo';
import Button from 'styled/Button';
import SearchBar from 'components/SearchBar';
import Avatar from 'components/Avatar';
import Loader from 'components/Loader';
import useStores from 'hooks/useStores';
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

export const Navbar: FC = () => {
  const { authStore, themeStore } = useStores();
  const { user } = authStore.authState;
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
          <ThemeButton onClick={() => themeStore.toggleTheme()}>
            {themeStore.theme === 'light' ? 'Dark mode' : 'Light mode'}
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

              <Button buttonType="primary">
                <Link
                  to={{
                    pathname: `/create/tweet`,
                    state: { tweetForm: location },
                  }}
                >
                  Tweet
                </Link>
              </Button>
              <Button buttonType="secondary" onClick={authStore.resetAuthState}>
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Link to="/log-in">
                <Button buttonType="primary">Log In</Button>
              </Link>
              <Link to="/sign-up">
                <Button buttonType="secondary">Sign Up</Button>
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
              theme={themeStore.theme}
              isActive={isActive}
              resetAuthState={() => authStore.resetAuthState()}
              toggleTheme={() => themeStore.toggleTheme()}
              authState={authStore.authState}
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
