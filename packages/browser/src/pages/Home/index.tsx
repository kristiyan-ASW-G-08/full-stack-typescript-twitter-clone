import React, { FC, useState, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import RootStoreContext from 'stores/RootStore';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer';
import Feed from 'types/Feed';
import HomeWrapper from './styled';

export const Home: FC = observer(() => {
  const { authStore } = useContext(RootStoreContext);
  const { token, user } = authStore.authState;
  const { REACT_APP_API_URL } = process.env;
  const [url, setUrl] = useState<string>(`${REACT_APP_API_URL}/tweets`);
  const feeds: Feed[] =
    user !== undefined
      ? [
          {
            name: 'Feed',
            url: `${REACT_APP_API_URL}/users/user/tweets`,
          },
          { name: 'All', url: `${REACT_APP_API_URL}/tweets` },
        ]
      : [];

  return (
    <PageContainer>
      <HomeWrapper>
        <TweetsContainer
          feeds={feeds}
          setUrl={setUrl}
          url={url}
          token={token}
        />
      </HomeWrapper>
    </PageContainer>
  );
});
export default Home;
