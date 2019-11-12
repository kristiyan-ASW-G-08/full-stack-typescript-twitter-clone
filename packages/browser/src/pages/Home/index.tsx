import React, { FC, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import RootStoreContext from 'stores/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer';
import Notification from 'types/Notification';
import Feed from 'types/Feed';
import getUrl from 'utilities/getUrl';
import HomeWrapper from './styled';

export const Home: FC = observer(() => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const { token, user } = authStore.authState;
  const [url, setUrl] = useState<string>(getUrl('/tweets'));
  const feeds: Feed[] =
    user !== undefined
      ? [
          {
            name: 'Feed',
            url: getUrl('/users/user/tweets'),
          },
          { name: 'All', url: getUrl('/tweets') },
        ]
      : [];

  return (
    <PageContainer>
      <HomeWrapper>
        <TweetsContainer
          feeds={feeds}
          setUrl={setUrl}
          url={url}
          setNotification={(notification: Notification) =>
            notificationStore.setNotification(notification)
          }
          token={token}
        />
      </HomeWrapper>
    </PageContainer>
  );
});
export default Home;
