import React, { FC, useState, useContext } from 'react';
import RootStoreContext from 'stores/RootStore/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer';
import Notification from 'types/Notification';
import Feed from 'types/Feed';

export const Home: FC = () => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const { token, user } = authStore.authState;
  const [url, setUrl] = useState<string>('http://localhost:8090/tweets');
  const feeds: Feed[] =
    user !== undefined
      ? [
          { name: 'All', url: 'http://localhost:8090/tweets' },
          { name: 'Feed', url: 'http://localhost:8090/users/user/tweets' },
        ]
      : [];
  return (
    <PageContainer>
      <TweetsContainer
        feeds={feeds}
        setUrl={setUrl}
        url={url}
        setNotification={(notification: Notification) =>
          notificationStore.setNotification(notification)
        }
        token={token}
      />
    </PageContainer>
  );
};
export default Home;
