import React, { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import User from 'types/User';
import Avatar from 'components/Avatar';
import AuthState from 'types/AuthState';
import FollowButton from 'components/UserCard/FollowButton';
import Button from 'styled/Button';
import {
  UserCardWrapper,
  Cover,
  AvatarContainer,
  CoverBackground,
  Username,
  Container,
  Handle,
  FollowBar,
  FollowButtonWrapper,
} from './styled';

interface UserCardProps {
  user: User;
  authState: AuthState;
  updateUser: (user: User | undefined) => void;
}
export const UserCard: FC<UserCardProps> = ({
  user,
  authState,
  updateUser,
}) => {
  const location = useLocation();
  const { username, handle, following, _id } = user;
  return (
    <UserCardWrapper direction="bottom">
      <Cover>
        <CoverBackground>
          {user.cover ? (
            <img
              src="https://d33wubrfki0l68.cloudfront.net/ca8962315fd188209b57905f1b1dc0e52ee7a57e/header.31d00de4.png"
              alt=""
            />
          ) : (
            ''
          )}
        </CoverBackground>
        <AvatarContainer>
          {authState.user && authState.user._id === user._id ? (
            <Link
              to={{
                pathname: `/user/customize`,
                state: { customization: location },
              }}
            >
              <Avatar size="large" />
            </Link>
          ) : (
            <Avatar size="large" />
          )}
        </AvatarContainer>
      </Cover>

      <Container>
        <Username>{username}</Username>
        <Handle>@{handle}</Handle>
        <FollowButtonWrapper>
          {authState.user && _id !== authState.user._id ? (
            <FollowButton
              authenticatedUser={authState.user}
              token={authState.token}
              currentUser={user}
              updateUser={updateUser}
            />
          ) : (
            <Link
              to={{
                pathname: `/user/edit`,
                state: { userForm: location },
              }}
            >
              <Button buttonType="primary">Edit</Button>
            </Link>
          )}
        </FollowButtonWrapper>
        <FollowBar>
          <p>
            {' '}
            <span>0</span>
            Followers
          </p>
          <p>
            <span>{following.length}</span>
            Following
          </p>
        </FollowBar>
      </Container>
    </UserCardWrapper>
  );
};
export default UserCard;
