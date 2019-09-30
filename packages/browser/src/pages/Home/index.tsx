import React, { FC, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import Tweet from 'types/Tweet';
import { Subtitle } from 'styled/Title';

export const Home: FC = () => {
  const { authStore } = useContext(RootStoreContext);
  const { isAuth } = authStore.authState;
  const [tweets, setTweets] = useState<Tweet[]>([]);
  useEffect(() => {
    const getTweets = async () => {
      try {
        const response = await axios.get('http://localhost:8090/tweets');
        const { tweets } = response.data.data;
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
      {tweets.length > 0 ? '' : <Subtitle>No tweets yet</Subtitle>}
    </section>
  );
};
export default Home;
