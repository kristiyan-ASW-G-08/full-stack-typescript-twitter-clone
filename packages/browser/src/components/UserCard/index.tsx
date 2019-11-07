/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import User from 'types/User';
import Avatar from 'components/Avatar';
import AuthState from 'types/AuthState';
import FollowButton from 'components/UserCard/FollowButton';
import Button from 'styled/Button';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';
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
  const { notificationStore } = useContext(RootStoreContext);
  const location = useLocation();
  const { username, handle, following, followers, _id, avatar, cover } = user;
  return (
    <UserCardWrapper direction="bottom" data-testid={_id}>
      <Cover>
        <CoverBackground>
          {cover ? <img src={cover} alt={`${username}'s cover`} /> : ''}
        </CoverBackground>
        <AvatarContainer>
          <Avatar size="large" avatarURL={avatar} />
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
              setNotification={(notification: Notification): void => {
                notificationStore.setNotification(notification);
              }}
            />
          ) : (
            ''
          )}
          {authState.user && _id === authState.user._id ? (
            <Link
              to={{
                pathname: `/user/edit`,
                state: { userForm: location },
              }}
            >
              <Button buttonType="primary">Edit</Button>
            </Link>
          ) : (
            ''
          )}
        </FollowButtonWrapper>
        <FollowBar>
          <Link to={`/users/${user._id}/followers`}>
            <span>{followers}</span> Followers
          </Link>
          <Link to={`/users/${user._id}/following`}>
            <span>{following.length}</span> Following
          </Link>
        </FollowBar>
      </Container>
    </UserCardWrapper>
  );
};
export default UserCard;
