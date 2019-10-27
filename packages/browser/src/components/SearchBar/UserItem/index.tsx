import React, { FC, memo } from 'react';
import { Link } from 'react-router-dom';
import Avatar from 'components/Avatar';
import User from 'types/User';
import { UserItemWrapper } from './styled';

interface UserItemProps {
  user: User;
}
export const UserItem: FC<UserItemProps> = ({ user }) => {
  const { handle, _id } = user;
  return (
    <UserItemWrapper>
      <Link to={`/users/${_id}`} key={_id}>
        <Avatar />
        <span>@{handle}</span>
      </Link>
    </UserItemWrapper>
  );
};
export default memo(UserItem);
