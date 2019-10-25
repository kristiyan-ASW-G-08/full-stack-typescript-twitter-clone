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
import Notification from 'types/Notification';
import Feed from 'types/Feed';
import User from 'types/User';
import Loader from 'components/Loader';
import TweetsContainer from 'components/TweetsContainer';
import { ProfileWrapper, UserCardWrapper, TweetsWrapper } from './styled';

const UserCard = lazy(() => import('components/UserCard/index'));

export const Profile: FC = () => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const { authState } = authStore;
  const [user, setUser] = useState<User>();
  const { userId } = useParams();
  const { token } = authStore.authState;
  const [url, setUrl] = useState<string>('');

  useEffect(() => {
    getUser(userId)
      .then(user => {
        setUser(user);
        setUrl(`http://localhost:8090/users/${user._id}/tweets`);
      })
      .catch(err => {});
  }, [userId]);
  //@ts-ignore
  const getUser = async (userId: string): Promise<User> => {
    try {
      const response = await axios.get(
        `http://localhost:8090/users/user/${userId}`,
      );
      const { user } = response.data.data;

      return user;
    } catch (err) {}
  };
  const feeds: Feed[] =
    user !== undefined
      ? [
          {
            name: 'Tweets',
            url: `http://localhost:8090/users/${user._id}/tweets`,
          },
          {
            name: 'Replies',
            url: `http://localhost:8090/users/${user._id}/replies`,
          },
        ]
      : [];
  return (
    <>
      {user && url ? (
        <ProfileWrapper>
          <Suspense fallback={<Loader />}>
            <UserCardWrapper>
              <UserCard
                user={user}
                authState={authState}
                updateUser={(user: User | undefined) =>
                  authStore.updateUser(user)
                }
              />
            </UserCardWrapper>
            <TweetsWrapper>
              <TweetsContainer
                feeds={feeds}
                setUrl={setUrl}
                url={url}
                setNotification={(notification: Notification) =>
                  notificationStore.setNotification(notification)
                }
                token={token}
              />
            </TweetsWrapper>
          </Suspense>
        </ProfileWrapper>
      ) : (
        <Loader />
      )}
    </>
  );
};
export default observer(Profile);
