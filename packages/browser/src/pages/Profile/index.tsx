import React, { FC, useState, useEffect, useContext, lazy } from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer/index';
import Notification from 'types/Notification';
import UserCard from 'components/UserCard/index';
import AuthState from 'types/AuthState';
import User from 'types/User';

interface ProfileProps {
  authState: AuthState;
}
export const Profile: FC<ProfileProps> = ({ authState }) => {
  const { userId } = useParams();
  // const getUser = async (): Promise<User> => {
  //   const response = await axios.get(
  //     'http://localhost:8090/users/user',
  //   );
  // };
  useEffect(() => {}, [userId]);
  console.log(userId);
  return <UserCard user={authState.user} />;
};
export default observer(Profile);
