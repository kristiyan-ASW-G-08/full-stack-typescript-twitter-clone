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
import TweetType from 'types/Tweet';
import Notification from 'types/Notification';
import Feed from 'types/Feed';
import useIntersection from 'hooks/useIntersection';
import defaultWarning from 'utilities/defaultWarning';
import FeedBar from 'components/FeedBar';
import Select from 'styled/Select';
import TextLoader from 'styled/TextLoader';
import getTweets from './getTweets';
import { TweetsWrapper, SelectWrapper, Tweets, LoaderWrapper } from './styled';

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
  const loadNext = async () => {
    try {
      if (nextPageRef.current) {
        console.log('observe', nextPageRef.current);
        const { newTweets, next } = await getTweets(nextPageRef.current, token);
        setTweets([...tweetsRef.current, ...newTweets]);
        setNext(next);
      }
    } catch {
      setNotification(defaultWarning);
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
        console.log(next);
        setNext(next);
        setTweets(newTweets);
      })
      .catch(() => {
        setNotification(defaultWarning);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, query]);

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
        <Suspense
          // eslint-disable-next-line prettier/prettier
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
