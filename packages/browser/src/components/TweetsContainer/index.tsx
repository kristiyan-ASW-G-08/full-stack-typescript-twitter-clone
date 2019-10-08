import React, {
  FC,
  SyntheticEvent,
  useRef,
  useEffect,
  useState,
} from 'react';
import getTweets from './getTweets';
import TweetType from 'types/Tweet';
import { TweetsWrapper, Select, Tweets, Loader } from './styled';
import Tweet from 'components/Tweet/index';
interface TweetProps {
  url: string;
}

export const TweetContainer: FC<TweetProps> = ({ url }) => {
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [nextPage, setNext] = useState<string | null>(null);
  const nextPageRef = useRef(nextPage);
  const [element, setElement] = useState<HTMLParagraphElement>();
  useEffect(() => {
    const currentElement = element;
    const { current } = observer;
    if (currentElement) {
      current.observe(currentElement);
    }
    return () => {
      if (currentElement) {
        current.unobserve(currentElement);
      }
    };
  }, [element]);
  useEffect(() => {
    nextPageRef.current = nextPage;
  }, [nextPage]);
  useEffect(() => {
    getTweets(`${url}?sort=new`).then(data => {
      const { newTweets, next } = data;
      setNext(next);
      setTweets(newTweets);
    });
  }, [url]);
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
          setNext(next);
          setTweets([...tweets, ...newTweets]);
        }
      },
      { threshold: 1 },
    ),
  );

  const getTweetsHandler = async (e: SyntheticEvent) => {
    const target = e.target as HTMLSelectElement;
    const { value } = target;
    const { newTweets } = await getTweets(`${url}?sort=${value}`);
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
      <Tweets>
        {tweets.map((tweet: TweetType) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
      </Tweets>
      {nextPage ? (
        <Loader ref={(e: HTMLParagraphElement) => setElement(e)}>
          ...Loading
        </Loader>
      ) : (
        ''
      )}
    </TweetsWrapper>
  );
};
export default TweetContainer;
