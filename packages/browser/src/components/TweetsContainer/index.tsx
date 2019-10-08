import React, {
  FC,
  SyntheticEvent,
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react';
import axios from 'axios';
import TweetType from 'types/Tweet';
import { TweetsWrapper, Select, Tweets, Loader } from './styled';
import Tweet from 'components/Tweet/index';
import Notification from 'types/Notification';
interface TweetProps {
  url: string;
  setNotification: (notification: Notification) => void;
}
export const TweetContainer: FC<TweetProps> = ({ url, setNotification }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const [element, setElement] = useState<HTMLParagraphElement>();
  const tweetsRef = useRef(tweets);
  const nextPageRef = useRef(nextPage);
  const observer = useRef(
    new IntersectionObserver(
      async entries => {
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
      },
      { threshold: 1 },
    ),
  );
  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;
    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);
  useEffect(() => {
    nextPageRef.current = nextPage;
  }, [nextPage]);
  useEffect(() => {
    tweetsRef.current = tweets;
  }, [tweets]);
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
        <Loader
          ref={(e: HTMLParagraphElement) => setElement(e)}
          style={{ background: 'transparent' }}
        />
      ) : (
        ''
      )}
    </TweetsWrapper>
  );
};
export default TweetContainer;
