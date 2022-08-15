import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Logo from 'components/Logo';
import SearchBar from 'components/SearchBar';
import AuthState from 'types/AuthState';
import Avatar from 'components/Avatar';
import UserCredentials from 'components/UserCredentials';
import {
  SidebarWrapper,
  Backdrop,
  Container,
  AuthenticationBar,
  AuthenticatedSidebarHeader,
  SidebarHeader,
  LogoContainer,
  SidebarBody,
  SidebarList,
  SidebarButton,
  SearchBarWrapper,
  AuthenticationButton,
} from './styled';

interface SidebarProps {
  isActive: boolean;
  authState: AuthState;
  theme: 'light' | 'dark';
  resetAuthState: () => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
}

export const Sidebar: FC<SidebarProps> = ({
  isActive,
  authState: { user },
  theme,
  resetAuthState,
  toggleTheme,
  toggleSidebar,
}) => {
  return (
    <>
      <SidebarWrapper isActive={isActive}>
        <Container>
          {user ? (
            <AuthenticatedSidebarHeader>
              <Link
                to={`/users/${user._id}`}
                data-testid="profile-link-sidebar"
              >
                <Avatar size="medium" avatar={user.avatar} />
              </Link>
              <UserCredentials
                username={user.username}
                handle={user.handle}
                _id={user._id}
                followers={user.followers}
                following={user.following.length}
              />
            </AuthenticatedSidebarHeader>
          ) : (
            <SidebarHeader>
              <LogoContainer>
                <Logo type="vertical" />
              </LogoContainer>
              <AuthenticationBar>
                <AuthenticationButton type="button" onClick={toggleSidebar}>
                  <Link to="/log-in">Log In</Link>
                </AuthenticationButton>
                <span>or</span>
                <AuthenticationButton type="button" onClick={toggleSidebar}>
                  {' '}
                  <Link to="/sign-up">Sign Up</Link>
                </AuthenticationButton>
              </AuthenticationBar>
            </SidebarHeader>
          )}
          <SidebarBody>
            <SearchBarWrapper>
              <SearchBar />
            </SearchBarWrapper>
            <SidebarList>
              <li>
                <Link to="/" onClick={toggleSidebar}>
                  <SidebarButton>
                    <span>
                      <FontAwesomeIcon size="lg" icon="home" />
                    </span>
                    <p>Home</p>
                  </SidebarButton>
                </Link>
              </li>
              {user ? (
                <li>
                  <Link to={`/users/${user._id}`} onClick={toggleSidebar}>
                    <SidebarButton>
                      <span>
                        <FontAwesomeIcon size="lg" icon="user" />
                      </span>
                      <p>Profile</p>
                    </SidebarButton>
                  </Link>
                </li>
              ) : (
                ''
              )}
              <li>
                <SidebarButton onClick={toggleTheme} data-testid="theme-button">
                  <span>
                    <FontAwesomeIcon
                      icon={theme === 'light' ? 'sun' : 'moon'}
                    />
                  </span>
                  <p>{theme} mode</p>
                </SidebarButton>
              </li>
            </SidebarList>
            {user ? (
              <SidebarButton onClick={resetAuthState}>
                <span>
                  <FontAwesomeIcon size="lg" icon="sign-out-alt" />
                </span>
                <p>Log Out</p>
              </SidebarButton>
            ) : (
              ''
            )}
          </SidebarBody>
        </Container>
        <Backdrop onClick={toggleSidebar} data-testid="backdrop" />
      </SidebarWrapper>
    </>
  );
};
export default observer(Sidebar);
