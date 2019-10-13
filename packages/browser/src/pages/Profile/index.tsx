import React, { FC, useState, useEffect, useContext, lazy } from 'react';
import { useParams } from 'react-router';
import { observer } from 'mobx-react-lite';
import RootStoreContext from 'stores/RootStore/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer/index';
import Notification from 'types/Notification';
import UserCard from 'components/UserCard/index';
import AuthState from 'types/AuthState';
interface ProfileProps {
  authState: AuthState;
}
export const Profile: FC<ProfileProps> = ({ authState }) => {
  // const { userId } = useParams();
  const { user } = authState;
  return <UserCard user={user} />;
};
export default observer(Profile);
