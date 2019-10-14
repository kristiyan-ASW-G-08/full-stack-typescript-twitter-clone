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
} from './styled';
import User from 'types/User';
import Avatar from 'components/Avatar/index';
interface UserCardProps {
  user: User;
}
export const Logo: FC<UserCardProps> = ({ user }) => {
  const { username, handle, avatar, followers, following } = user;
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
export default memo(Logo);
