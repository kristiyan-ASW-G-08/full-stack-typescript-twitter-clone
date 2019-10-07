import React, { FC, useState, useEffect, useContext, lazy } from 'react';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import TweetType from 'types/Tweet';
import { Subtitle } from 'styled/Title';
import CenteredLoader from 'components/CenteredLoader';
import PageContainer from 'styled/PageContainer';
import TweetsContainer from 'components/TweetsContainer/index';

export const Home: FC = () => {
  const { authStore } = useContext(RootStoreContext);
  const { isAuth } = authStore.authState;
  const [tweets, setTweets] = useState<TweetType[]>([]);

  return (
    <PageContainer>
      <TweetsContainer />
    </PageContainer>
  );
};
export default Home;
