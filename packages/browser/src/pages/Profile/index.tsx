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
  const [url, setUrl] = useState<string>('');
  const { token } = authStore.authState;

  useEffect(() => {
    const getUser = async (userId: string): Promise<any> => {
      try {
        const response = await axios.get(
          `http://localhost:8090/users/user/${userId}`,
        );

        const { user } = response.data.data;

        return user;
      } catch (err) {
        console.log(err);
        const notification: Notification = {
          type: 'warning',
          content: 'Something went wrong',
        };
        notificationStore.setNotification(notification);
      }
    };
    getUser(userId || '').then((userData: User) => {
      setUser(userData);
      setUrl(
        userData ? `http://localhost:8090/users/${userData._id}/tweets` : '',
      );
    });
  }, [notificationStore, userId]);

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
          {
            name: 'Likes',
            url: `http://localhost:8090/users/${user._id}/likes`,
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
                updateUser={(updatedUser: User | undefined) =>
                  authStore.updateUser(updatedUser)
                }
              />
            </UserCardWrapper>
            <TweetsWrapper>
              <TweetsContainer
                feeds={
                  authState.user && userId === authState.user._id
                    ? [
                        ...feeds,
                        {
                          name: 'Bookmarks',
                          url: `http://localhost:8090/users/user/bookmarks`,
                        },
                      ]
                    : feeds
                }
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
