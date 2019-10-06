import React, {
  FC,
  useState,
  useEffect,
  useContext,
  Suspense,
  lazy,
} from 'react';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import TweetType from 'types/Tweet';
import { Subtitle } from 'styled/Title';
import CenteredLoader from 'components/CenteredLoader';
import PageContainer from 'styled/PageContainer';
const TweetsContainer = lazy(() => import('components/TweetsContainer/index'));

export const Home: FC = () => {
  const { authStore } = useContext(RootStoreContext);
  const { isAuth } = authStore.authState;
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const getTweets = async (
    sort: string = 'new',
    url: string = 'http://localhost:8090/tweets',
  ): Promise<void> => {
    try {
      const response = await axios.get(`${url}?sort=${sort}`);
      const { tweets } = response.data.data;
      console.log(tweets);
      setTweets(tweets);
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };
  useEffect(() => {
    getTweets();
  }, []);
  return (
    <PageContainer>
      {tweets.length > 0 ? (
        <Suspense fallback={<CenteredLoader />}>
          <TweetsContainer tweets={tweets} getTweets={getTweets} />
        </Suspense>
      ) : (
        <Subtitle>No tweets yet</Subtitle>
      )}
    </PageContainer>
  );
};
export default Home;
