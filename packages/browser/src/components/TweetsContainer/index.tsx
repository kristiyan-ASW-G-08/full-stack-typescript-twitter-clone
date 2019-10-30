import React, {
  FC,
  SyntheticEvent,
  useRef,
  useEffect,
  useState,
  useMemo,
  Suspense,
  lazy,
  Dispatch,
  SetStateAction,
} from 'react';
import TweetType from 'types/Tweet';
import Notification from 'types/Notification';
import Feed from 'types/Feed';
import useIntersection from 'hooks/useIntersection';
import FeedBar from 'components/FeedBar';
import getTweets from './getTweets';
import { TweetsWrapper, Select, Tweets, TextLoader } from './styled';

const Tweet = lazy(() => import('components/Tweet'));
const Retweet = lazy(() => import('components/Retweet'));

interface TweetsContainerProps {
  url: string;
  setNotification: (notification: Notification) => void;
  setUrl: Dispatch<SetStateAction<string>>;
  feeds: Feed[];
  token: string;
  hasBorderRadius?: boolean;
}
export const TweetsContainer: FC<TweetsContainerProps> = ({
  url,
  setNotification,
  setUrl,
  feeds,
  token,
  hasBorderRadius,
}) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const [query, setQuery] = useState<string>(`${url}?sort=new`);
  const tweetsRef = useRef(tweets);
  const nextPageRef = useRef(nextPage);
  const errorNotification: Notification = useMemo(() => {
    return {
      type: 'warning',
      content: 'There was an error. Please try again later.',
    };
  }, []);
  const loadNext = async () => {
    try {
      if (nextPageRef.current) {
        const { newTweets, next } = await getTweets(nextPageRef.current, token);
        const allTweets = [...tweetsRef.current, ...newTweets];
        setTweets(allTweets);
        setNext(next);
      }
    } catch {
      setNotification(errorNotification);
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
      .then(data => {
        const { newTweets, next } = data;
        setNext(next);
        setTweets(newTweets);
      })
      .catch(() => {
        setNotification(errorNotification);
      });
  }, [token, url, setNotification, errorNotification, query]);

  const getTweetsHandler = (e: SyntheticEvent) => {
    const target = e.target as HTMLSelectElement;
    const { value } = target;
    setQuery(`${url}?sort=${value}`);
  };

  const deleteTweetHandler = (tweetId: string): void => {
    setTweets(tweets.filter(tweet => tweet._id !== tweetId));
  };
  return (
    <TweetsWrapper hasBorderRadius={hasBorderRadius}>
      <FeedBar currentUrl={url} setUrl={setUrl} feeds={feeds} />
      {tweets.length > 0 ? (
        <Suspense fallback={<TextLoader>...Loading</TextLoader>}>
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

          <Tweets role="feed">
            {tweets.map((tweet: TweetType) =>
              tweet.retweet ? (
                <Retweet key={tweet._id} tweet={tweet}>
                  <Tweet
                    deleteTweetHandler={deleteTweetHandler}
                    key={tweet._id}
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

      {nextPage ? (
        <TextLoader ref={(e: HTMLDivElement) => setElement(e)}>
          ...Loading
        </TextLoader>
      ) : (
        <TextLoader>No Tweets Available</TextLoader>
      )}
    </TweetsWrapper>
  );
};
export default TweetsContainer;
