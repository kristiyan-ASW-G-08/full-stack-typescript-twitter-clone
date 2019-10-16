import React, { FC, useState, useEffect } from 'react';
import axios from 'axios';
import { observer } from 'mobx-react-lite';
import AuthState from 'types/AuthState';
import User from 'types/User';
import Button from 'styled/Button';

interface FollowButtonProps {
  authenticatedUser: User;
  currentUser: User;
  token: string;
  updateUser: (user: User | undefined) => void;
}
export const FollowButton: FC<FollowButtonProps> = ({
  authenticatedUser,
  token,
  currentUser,
  updateUser,
}) => {
  const { following } = authenticatedUser;
  const isFollowing = following.includes(currentUser._id);
  useEffect(() => {}, [following]);
  const followHandler = async () => {
    try {
      const config = {
        headers: { Authorization: 'bearer ' + token },
      };
      const response = await axios.patch(
        `http://localhost:8090/users/${currentUser._id}`,
        {},
        config,
      );

      const { user } = response.data.data;
      updateUser(user);
    } catch (err) {}
  };
  return (
    <Button
      buttonType={isFollowing ? 'primary' : 'secondary'}
      onClick={followHandler}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
export default observer(FollowButton);
