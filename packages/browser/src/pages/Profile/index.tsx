import React, {
  FC,
  useState,
  useEffect,
  useContext,
  lazy,
  Suspense,
} from 'react';
import { useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer/index';
import Notification from 'types/Notification';
import AuthState from 'types/AuthState';
import User from 'types/User';
import Loader from 'components/Loader';

const UserCard = lazy(() => import('components/UserCard/index'));

interface ProfileProps {
  authState: AuthState;
}
export const Profile: FC<ProfileProps> = ({ authState }) => {
  const [user, setUser] = useState<User>();
  const { userId } = useParams();

  //@ts-ignore
  const getUser = async (userId: string): Promise<User> => {
    try {
      const response = await axios.get(
        `http://localhost:8090/users/user/${userId}`,
      );
      const { user } = response.data.data;
      console.log(user);
      return user;
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUser(userId)
      .then(user => setUser(user))
      .catch(err => {});
  }, [userId]);
  console.log(userId);
  return (
    <>
      {user ? (
        <Suspense fallback={<Loader />}>
          <UserCard user={user} />
        </Suspense>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default observer(Profile);
