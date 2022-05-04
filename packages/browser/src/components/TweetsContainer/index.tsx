import React, {
  FC,
  SyntheticEvent,
  useRef,
  useEffect,
  useState,
  Suspense,
  lazy,
  Dispatch,
  SetStateAction,
} from 'react';
import axios from 'axios';
import TweetType from 'types/Tweet';
import Feed from 'types/Feed';
import useIntersection from 'hooks/useIntersection';
import FeedBar from 'components/FeedBar';
import Select from 'styled/Select';
import TextLoader from 'styled/TextLoader';
import useStores from 'hooks/useStores';
import defaultWarning from 'utilities/defaultWarning';
import getTweets from './getTweets';
import { TweetsWrapper, SelectWrapper, Tweets, LoaderWrapper } from './styled';

const Tweet = lazy(() => import('components/Tweet'));
const Retweet = lazy(() => import('components/Retweet'));

interface TweetsContainerProps {
  url: string;
  setUrl: Dispatch<SetStateAction<string>>;
  feeds: Feed[];
  token: string;
  hasBorderRadius?: boolean;
}
export const TweetsContainer: FC<TweetsContainerProps> = ({
  url,
  setUrl,
  feeds,
  token,
  hasBorderRadius,
}) => {
  const { notificationStore } = useStores();
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(`${url}?sort=new`);
  const { REACT_APP_API_URL } = process.env;
  const tweetsRef = useRef(tweets);
  const nextPageRef = useRef(nextPage);
  const loadNext = async () => {
    try {
      if (nextPageRef?.current) {
        const { newTweets, next } = await getTweets(nextPageRef.current, token);
        setTweets([...tweetsRef.current, ...newTweets]);
        setNext(next);
      }
    } catch {
      notificationStore.setNotification();
    }
  };

  const { setElement } = useIntersection(loadNext);
  useEffect(() => {
    setQuery(`${url}?sort=new`);
  }, [url]);
  useEffect(() => {
    tweetsRef.current = tweets;
    nextPageRef.current = nextPage;
  }, [tweets, nextPage]);

  useEffect(() => {
    getTweets(query, token)
      .then(({ newTweets, next }) => {
        setNext(next);
        setTweets(newTweets);
      })
      .catch(() => notificationStore.setNotification());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, query]);

  const getTweetsHandler = (e: SyntheticEvent) => {
    const { value } = e.target as HTMLSelectElement;
    setQuery(`${url}?sort=${value}`);
  };

  const deleteTweetHandler = async (tweetId: string): Promise<void> => {
    setTweets(tweets.filter(({ _id }) => _id !== tweetId));
    try {
      await axios.delete(`${REACT_APP_API_URL}/tweets/${tweetId}`, {
        headers: { Authorization: `bearer ${token}` },
      });
    } catch {
      notificationStore.setNotification(defaultWarning);
    }
  };

  return (
    <TweetsWrapper hasBorderRadius={hasBorderRadius}>
      <FeedBar currentUrl={url} setUrl={setUrl} feeds={feeds} />
      {tweets.length > 0 ? (
        <Suspense
          fallback={(
            <Tweets>
              <TextLoader>...Loading</TextLoader>
            </Tweets>
          )}
        >
          <SelectWrapper>
            <Select data-testid="sort" onChange={getTweetsHandler}>
              <option data-testid="new" value="new">
                New
              </option>
              <option data-testid="top" value="top">
                Top
              </option>
              <option data-testid="trending" value="trending">
                Trending
              </option>
              <option data-testid="replies" value="replies">
                Replies
              </option>
            </Select>
          </SelectWrapper>

          <Tweets role="feed">
            {tweets.map((tweet: TweetType) =>
              tweet.retweet ? (
                <Retweet key={tweet._id} tweet={tweet}>
                  <Tweet
                    deleteTweetHandler={deleteTweetHandler}
                    tweet={tweet.retweet}
                  />
                </Retweet>
              ) : (
                <Tweet
                  deleteTweetHandler={deleteTweetHandler}
                  key={tweet._id}
                  tweet={tweet}
                />
              ),
            )}
          </Tweets>
        </Suspense>
      ) : (
        ''
      )}
      <LoaderWrapper>
        {nextPage ? (
          <TextLoader ref={(e: HTMLDivElement) => setElement(e)}>
            ...Loading
          </TextLoader>
        ) : (
          <TextLoader>No Tweets Available</TextLoader>
        )}
      </LoaderWrapper>
    </TweetsWrapper>
  );
};
export default TweetsContainer;
