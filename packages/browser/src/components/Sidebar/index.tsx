import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import Logo from 'components/Logo';
import SearchBar from 'components/SearchBar';
import AuthState from 'types/AuthState';
import Avatar from 'components/Avatar';
import ThemeButton from 'components/ThemeButton';
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
  authState,
  theme,
  resetAuthState,
  toggleTheme,
  toggleSidebar,
}) => {
  const { user } = authState;
  return (
    <>
      <SidebarWrapper isActive={isActive}>
        <Container>
          {user ? (
            <AuthenticatedSidebarHeader>
              <Avatar size="medium" avatarURL={user.avatar} />
              <h3>{user.username}</h3>
              <h4>@{user.handle}</h4>
              <div>
                <button type="button">
                  <span>0</span> Followers
                </button>
                <button type="button">
                  <span>{user.following.length}</span> Following
                </button>
              </div>
            </AuthenticatedSidebarHeader>
          ) : (
            <SidebarHeader>
              <LogoContainer>
                <Logo type="vertical" />
              </LogoContainer>
              <AuthenticationBar>
                <button type="button" onClick={toggleSidebar}>
                  <Link to="/log-in">Log In</Link>
                </button>
                <span>or</span>
                <button type="button" onClick={toggleSidebar}>
                  {' '}
                  <Link to="/sign-up">Sign Up</Link>
                </button>
              </AuthenticationBar>
            </SidebarHeader>
          )}
          <SidebarBody>
            <SearchBarWrapper>
              {' '}
              <SearchBar />
            </SearchBarWrapper>

            <SidebarList>
              <li>
                <Link to="/" onClick={toggleSidebar}>
                  <SidebarButton>
                    <span>
                      <FontAwesomeIcon icon="home" />
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
                        <FontAwesomeIcon icon="user" />
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
                  <ThemeButton theme={theme} />
                </SidebarButton>
              </li>
            </SidebarList>
            {user ? (
              <SidebarButton onClick={resetAuthState}>
                <span>
                  <FontAwesomeIcon icon="sign-out-alt" />
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
