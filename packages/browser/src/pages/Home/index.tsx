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
const TweetsContainer = lazy(() => import('components/TweetsContainer/index'));

export const Home: FC = () => {
  const { authStore } = useContext(RootStoreContext);
  const { isAuth } = authStore.authState;
  const [tweets, setTweets] = useState<TweetType[]>([]);
  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tweets');
        const { tweets } = response.data.data;
        console.log(tweets);
        setTweets(tweets);
      } catch (error) {
        if (error.response) {
          console.log(error.response);
        }
      }
    };
    getTweets();
  }, []);
  return (
    <section>
      {tweets.length > 0 ? (
        <Suspense fallback={<CenteredLoader />}>
          <TweetsContainer tweets={tweets} />
        </Suspense>
      ) : (
        <Subtitle>No tweets yet</Subtitle>
      )}
    </section>
  );
};
export default Home;
