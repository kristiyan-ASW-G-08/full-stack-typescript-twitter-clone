import React, {
  FC,
  SyntheticEvent,
  useRef,
  useEffect,
  useState,
  Suspense,
  lazy,
} from 'react';
import TweetType from 'types/Tweet';
import { TweetsWrapper, Select, Tweets, TextLoader } from './styled';
import Notification from 'types/Notification';
import useIntersection from 'hooks/useIntersection';
import getTweets from './getTweets';

const Tweet = lazy(() => import('components/Tweet'));
const Retweet = lazy(() => import('components/Retweet'));

interface TweetProps {
  url: string;
  setNotification: (notification: Notification) => void;
}
export const TweetContainer: FC<TweetProps> = ({ url, setNotification }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const tweetsRef = useRef(tweets);
  const nextPageRef = useRef(nextPage);
  const loadMore = async () => {
    if (nextPageRef.current) {
      const { newTweets, next } = await getTweets(
        nextPageRef.current,
        setNotification,
      );
      const allTweets = [...tweetsRef.current, ...newTweets];
      setTweets(allTweets);
      setNext(next);
    }
  };
  const { setElement } = useIntersection(loadMore);

  useEffect(() => {
    tweetsRef.current = tweets;
    nextPageRef.current = nextPage;
  }, [tweets, nextPage]);
  useEffect(() => {
    getTweets(`${url}?sort=new`, setNotification)
      .then(data => {
        const { newTweets, next } = data;
        setNext(next);
        setTweets(newTweets);
      })
      .catch(error => {
        //Error is being handled in getTweets
      });
  }, [url]);
  const getTweetsHandler = async (e: SyntheticEvent) => {
    const target = e.target as HTMLSelectElement;
    const { value } = target;
    const { newTweets, next } = await getTweets(
      `${url}?sort=${value}`,
      setNotification,
    );
    setNext(next);
    setTweets(newTweets);
  };
  return (
    <TweetsWrapper>
      <>
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
        <Suspense
          fallback={
            <TextLoader ref={(e: HTMLDivElement) => setElement(e)}>
              <p>...Loading</p>
            </TextLoader>
          }
        >
          <Tweets role="feed">
            {tweets.map((tweet: TweetType) =>
              tweet.retweet ? (
                <Retweet key={tweet._id} tweet={tweet}>
                  <Tweet key={tweet._id} tweet={tweet.retweet} />
                </Retweet>
              ) : (
                <Tweet key={tweet._id} tweet={tweet} />
              ),
            )}
          </Tweets>
        </Suspense>
      </>
      {nextPage ? (
        <TextLoader ref={(e: HTMLDivElement) => setElement(e)}>
          <p>...Loading</p>
        </TextLoader>
      ) : (
        <TextLoader>
          <p>No Tweets Available</p>
        </TextLoader>
      )}
    </TweetsWrapper>
  );
};
export default TweetContainer;
