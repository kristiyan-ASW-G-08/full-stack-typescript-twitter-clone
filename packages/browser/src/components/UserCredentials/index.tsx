import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import { CredentialsWrapper, LinksContainer, Username, Handle } from './styled';

interface UserCredentialsProps {
  username: string;
  handle: string;
  _id: string;
  followers: number;
  following: number;
}
export const UserCredentials: FC<UserCredentialsProps> = ({
  username,
  handle,
  followers,
  following,
  _id,
}) => (
  <CredentialsWrapper>
    <Username>{username}</Username>
    <Handle>@{handle}</Handle>
    <LinksContainer>
      <Link to={`/users/${_id}/followers`} data-testid="followers-link">
        <span>{followers || 0}</span> Followers
      </Link>
      <Link to={`/users/${_id}/following`} data-testid="following-link">
        <span>{following}</span> Following
      </Link>
    </LinksContainer>
  </CredentialsWrapper>
);

export default memo(UserCredentials);
