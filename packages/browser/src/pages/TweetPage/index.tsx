import React, { FC, useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import RootStoreContext from 'stores/RootStore/RootStore';
import TweetsContainer from 'components/TweetsContainer/index';
import Notification from 'types/Notification';
import TweetType from 'types/Tweet';
import Tweet from 'components/Tweet';

import { TweetPageWrapper, P } from './styled';

export const TweetPage: FC = () => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const [tweet, setTweet] = useState<TweetType>();
  const [url, setUrl] = useState<string>('');
  const { token } = authStore.authState;
  const { tweetId } = useParams();
  const history = useHistory();

  useEffect(() => {
    // @ts-ignore
    const getTweet = async (): Promise<{ tweet: TweetType; url: string }> => {
      try {
        const request = await axios.get(
          `http://localhost:8090/tweets/${tweetId}`,
        );
        const { tweet } = request.data.data;
        setTweet(tweet);
        setUrl(`http://localhost:8090/tweets/${tweet._id}/replies`);
        return {
          url: `http://localhost:8090/tweets/${tweet._id}/replies`,
          tweet,
        };
      } catch (error) {
        const notification: Notification = {
          type: 'warning',
          content: 'Something went wrong. Try again later.',
        };
        notificationStore.setNotification(notification);
      }
    };
    getTweet().then(({ tweet, url }) => {
      setTweet(tweet);
      setUrl(url);
    });
  }, [notificationStore, tweetId]);
  return (
    <>
      {tweet && url ? (
        <TweetPageWrapper>
          <Tweet tweet={tweet} deleteTweetHandler={() => history.goBack()} />
          <P>Replies</P>
          <TweetsContainer
            feeds={[]}
            setUrl={setUrl}
            url={url}
            setNotification={(notification: Notification) =>
              notificationStore.setNotification(notification)
            }
            hasBorderRadius={false}
            token={token}
          />
        </TweetPageWrapper>
      ) : (
        ''
      )}
    </>
  );
};
export default TweetPage;
