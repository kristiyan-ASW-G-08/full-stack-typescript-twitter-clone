/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { FC, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import User from 'types/User';
import Avatar from 'components/Avatar';
import AuthState from 'types/AuthState';
import FollowButton from 'components/UserCard/FollowButton';
import UserCredentials from 'components/UserCredentials';
import Button from 'styled/Button';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';
import {
  UserCardWrapper,
  Cover,
  AvatarContainer,
  CoverBackground,
  Container,
  FollowButtonWrapper,
  CredentialsContainer,
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
          <Link to={`/users/${user._id}`} data-testid="profile-link-usercard">
            <Avatar size="large" avatarURL={avatar} />
          </Link>
        </AvatarContainer>
      </Cover>
      <Container>
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
            <Button buttonType="primary">
              <Link
                to={{
                  pathname: `/user/edit`,
                  state: { userForm: location },
                }}
              >
                Edit
              </Link>
            </Button>
          ) : (
            ''
          )}
        </FollowButtonWrapper>
        <CredentialsContainer>
          <UserCredentials
            username={username}
            handle={handle}
            followers={followers}
            following={following.length}
            _id={_id}
          />
        </CredentialsContainer>
      </Container>
    </UserCardWrapper>
  );
};
export default UserCard;
