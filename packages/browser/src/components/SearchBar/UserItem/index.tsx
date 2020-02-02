import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import User from 'types/User';
import { UserItemWrapper } from './styled';

interface UserItemProps {
  user: User;
}
export const UserItem: FC<UserItemProps> = ({
  user: { handle, _id, avatar },
}) => (
  <UserItemWrapper>
    <Link to={`/users/${_id}`} key={_id}>
      <Avatar avatarURL={avatar} />
      <span>@{handle}</span>
    </Link>
  </UserItemWrapper>
);

export default memo(UserItem);
