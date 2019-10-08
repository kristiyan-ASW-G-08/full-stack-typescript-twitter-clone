import React, { FC, useState, useEffect, useContext, lazy } from 'react';
import RootStoreContext from 'stores/RootStore/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer/index';
import Notification from 'types/Notification';
export const Home: FC = () => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const { isAuth } = authStore.authState;
  const [url, setUrl] = useState<string>('http://localhost:8090/tweets');

  return (
    <PageContainer>
      <TweetsContainer
        url={url}
        setNotification={(notification: Notification) =>
          notificationStore.setNotification(notification)
        }
      />
    </PageContainer>
  );
};
export default Home;
