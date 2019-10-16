import React, { FC, memo } from 'react';
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
import { observer } from 'mobx-react-lite';
import User from 'types/User';
import Avatar from 'components/Avatar/index';
import AuthState from 'types/AuthState';
import FollowButton from 'components/UserCard/FollowButton/index';

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
  const { username, handle, avatar, followers, following, _id } = user;
  return (
    <UserCardWrapper direction={'bottom'}>
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
          <Avatar size={'large'}></Avatar>
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
            ''
          )}
        </FollowButtonWrapper>
        <FollowBar>
          <p>
            {' '}
            <span>0</span>Followers
          </p>
          <p>
            <span>{following.length}</span>Following
          </p>
        </FollowBar>
      </Container>
    </UserCardWrapper>
  );
};
export default observer(UserCard);
