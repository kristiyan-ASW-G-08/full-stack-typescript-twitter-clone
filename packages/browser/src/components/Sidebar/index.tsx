import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
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
import Logo from 'components/Logo';
import SearchBar from 'components/SearchBar';
import AuthState from 'types/AuthState';
import Avatar from 'components/Avatar/index';

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
  const { user, isAuth, token } = authState;
  const { username, handle, following, followers } = user;
  console.log(user);
  return (
    <>
      {' '}
      {useMemo(
        () => (
          <SidebarWrapper on={isActive}>
            <Container>
              {authState.isAuth ? (
                <AuthenticatedSidebarHeader>
                  <Avatar size="large" />
                  <h3>{username}</h3>
                  <h4>@{handle}</h4>
                  <div>
                    <button>
                      <span>0</span> Followers
                    </button>
                    <button>
                      <span>{following.length}</span> Following
                    </button>
                  </div>
                </AuthenticatedSidebarHeader>
              ) : (
                <SidebarHeader>
                  <LogoContainer>
                    <Logo type="vertical" />
                  </LogoContainer>
                  <AuthenticationBar>
                    <button onClick={toggleSidebar}>
                      <Link to="/log-in">Log In</Link>
                    </button>
                    <span>or</span>
                    <button onClick={toggleSidebar}>
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
                    <Link to={'/'} onClick={toggleSidebar}>
                      <SidebarButton>
                        <span>
                          <FontAwesomeIcon icon={'home'} />
                        </span>
                        <p>Home</p>
                      </SidebarButton>
                    </Link>
                  </li>
                  {authState.isAuth ? (
                    <>
                      {' '}
                      <li>
                        <Link
                          to={`/profile/${authState.user._id}`}
                          onClick={toggleSidebar}
                        >
                          <SidebarButton>
                            <span>
                              <FontAwesomeIcon icon={'user'} />
                            </span>
                            <p>Profile</p>
                          </SidebarButton>
                        </Link>
                      </li>
                      <li>
                        <SidebarButton>
                          <span>
                            <FontAwesomeIcon icon={'bookmark'} />
                          </span>
                          <p>Bookmarks</p>
                        </SidebarButton>
                      </li>
                    </>
                  ) : (
                    ''
                  )}
                  <li>
                    <SidebarButton
                      onClick={toggleTheme}
                      data-testid={'theme-button'}
                    >
                      {theme === 'light' ? (
                        <>
                          <span>
                            <FontAwesomeIcon icon={'moon'} />
                          </span>
                          <p>Dark Theme</p>
                        </>
                      ) : (
                        <>
                          <span>
                            <FontAwesomeIcon icon={'sun'} />
                          </span>
                          <p>Light Theme</p>
                        </>
                      )}
                    </SidebarButton>
                  </li>
                </SidebarList>
                {isAuth ? (
                  <SidebarButton onClick={resetAuthState}>
                    <span>
                      <FontAwesomeIcon icon={'sign-out-alt'} />
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
        ),
        [isActive, isAuth],
      )}
    </>
  );
};
export default observer(Sidebar);
