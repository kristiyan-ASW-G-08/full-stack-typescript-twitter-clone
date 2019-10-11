import React, {
  FC,
  SyntheticEvent,
  useRef,
  useEffect,
  useState,
  useMemo,
  memo,
} from 'react';
import axios from 'axios';
import TweetType from 'types/Tweet';
import { TweetsWrapper, Select, Tweets, LoaderContainer } from './styled';
import Tweet from 'components/Tweet/index';
import Notification from 'types/Notification';

interface TweetProps {
  url: string;
  setNotification: (notification: Notification) => void;
}
export const TweetContainer: FC<TweetProps> = ({ url, setNotification }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const [element, setElement] = useState<HTMLDivElement>();
  const tweetsRef = useRef(tweets);
  const nextPageRef = useRef(nextPage);
  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        try {
          const intersectedElement = entries[0];
          if (
            intersectedElement &&
            intersectedElement.isIntersecting &&
            nextPageRef &&
            nextPageRef.current
          ) {
            const { newTweets, next } = await getTweets(nextPageRef.current);
            const allTweets = [...tweetsRef.current, ...newTweets];
            setTweets(allTweets);
            setNext(next);
          }
        } catch (error) {}
      },
      { threshold: 1 },
    ),
  );
  useEffect(() => {
    const { current } = observer;
    if (element) {
      current.observe(element);
    }
    return () => {
      if (element) {
        current.unobserve(element);
      }
    };
  }, [element]);
  useEffect(() => {
    tweetsRef.current = tweets;
    nextPageRef.current = nextPage;
  }, [tweets, nextPage]);
  useEffect(() => {
    getTweets(`${url}?sort=new`)
      .then(data => {
        const { newTweets, next } = data;
        setNext(next);
        setTweets(newTweets);
      })
      .catch(error => {});
  }, [url]);

  const getTweets = async (
    url: string,
    //@ts-ignore,
  ): Promise<{
    newTweets: TweetType[];
    next: string | null;
    prev: string | null;
  }> => {
    try {
      const response = await axios.get(`${url}`);
      const { links, tweets } = response.data.data;
      const { next, prev } = links;
      return { newTweets: tweets, next, prev };
    } catch (error) {
      console.log(error);
      const notification: Notification = {
        type: 'warning',
        content: 'There was an error. Please try again later.',
      };
      setNotification(notification);
    }
  };

  const getTweetsHandler = async (e: SyntheticEvent) => {
    const target = e.target as HTMLSelectElement;
    const { value } = target;
    const { newTweets, next } = await getTweets(`${url}?sort=${value}`);
    setNext(next);
    setTweets(newTweets);
  };
  return (
    <TweetsWrapper>
      <Select onChange={getTweetsHandler}>
        <option value="new">New</option>
        <option value="top">Top</option>
        <option value="trending">Trending</option>
        <option value="replies">Replies</option>
      </Select>
      {useMemo(
        () => (
          <Tweets>
            {tweets.map((tweet: TweetType) => (
              <Tweet key={tweet._id} tweet={tweet} />
            ))}
          </Tweets>
        ),
        [tweets],
      )}
      {nextPage ? (
        <LoaderContainer ref={(e: HTMLDivElement) => setElement(e)} />
      ) : (
        ''
      )}
    </TweetsWrapper>
  );
};
export default memo(TweetContainer);
