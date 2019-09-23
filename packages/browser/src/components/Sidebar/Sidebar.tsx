import React, { FC, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  StyledSidebar,
  Backdrop,
  Container,
  AuthenticationBar,
  AuthenticatedSidebarHeader,
  SidebarHeader,
  LogoContainer,
  SidebarBody,
  SidebarList,
  SidebarButton,
} from './StyledSidebar';
import Logo from 'components/Logo/Logo';
import SearchBar from 'components/SearchBar/SearchBar';
import AuthState from 'types/AuthState';
import Avatar from 'styled/Avatar';

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
  console.log(following, followers);
  return (
    <StyledSidebar on={isActive}>
      <Container>
        {authState.isAuth ? (
          <AuthenticatedSidebarHeader>
            <Avatar size="large">
              <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" />
            </Avatar>
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
              <button>Log In</button>
              <span>or</span>
              <button>Sign Up</button>
            </AuthenticationBar>
          </SidebarHeader>
        )}
        <SidebarBody>
          <SearchBar />
          <SidebarList>
            <li>
              <SidebarButton>
                <span>
                  <FontAwesomeIcon icon={'home'} />
                </span>
                <p>Home</p>
              </SidebarButton>
            </li>
            {authState.isAuth ? (
              <>
                {' '}
                <li>
                  <SidebarButton>
                    <span>
                      <FontAwesomeIcon icon={'user'} />
                    </span>
                    <p>Profile</p>
                  </SidebarButton>
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
            <SidebarButton onClick={ resetAuthState}>
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
    </StyledSidebar>
  );
};
export default observer(Sidebar);
