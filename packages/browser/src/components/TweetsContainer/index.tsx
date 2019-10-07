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
import { TweetsWrapper, Select, Tweets, Loader } from './styled';
import axios from 'axios';
import Tweet from 'components/Tweet/index';
interface TweetProps {}

export const TweetContainer: FC<TweetProps> = () => {
  // const loader = useRef()
  const [tweets, setTweets] = useState<TweetType[]>([]);
  const [sort, setSort] = useState<string>('new');
  const [nextPage, setNext] = useState<string | null>(null);
  const [prevPage, setPrev] = useState<string | null>(null);
  const observer = useRef(
    new IntersectionObserver(
      async entries => {
        console.log(entries);
        const first = entries[0];
        if (first.isIntersecting) {
          if (nextPage !== null) {
            console.log('loading more');
            const { newTweets, next, prev } = await getTweets(sort, nextPage);
          }
        }
      },
      { threshold: 1 },
    ),
  );
  const [element, setElement] = useState<HTMLParagraphElement>();
  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    if (currentElement) {
      currentObserver.observe(currentElement);
    }
    return () => {
      if (currentElement !== undefined) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);
  useEffect(() => {
    getTweets().then(data => {
      const { newTweets, next, prev } = data;
      setTweets(newTweets);
    });
  }, []);
  const getTweets = async (
    sort: string = 'new',
    url: string = 'http://localhost:8090/tweets',
    //@ts-ignore
  ): Promise<{
    newTweets: TweetType[];
    next: null | string;
    prev: null | string;
  }> => {
    try {
      const response = await axios.get(`${url}?sort=${sort}`);
      console.log(response.data.data);
      const { next, prev } = response.data.data;
      const newTweets = response.data.data.tweets;
      return { newTweets, next, prev };
    } catch (error) {
      if (error.response) {
        console.log(error.response);
      }
    }
  };
  const getTweetsHandler = async (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value: string = target.value;
    const { newTweets } = await getTweets(value);
    setSort(value);
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
        {tweets.map((tweet: TweetType, index) => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
      </Tweets>

      <Loader ref={(e: HTMLParagraphElement) => setElement(e)}>
        ...Loading
      </Loader>
    </TweetsWrapper>
  );
};
export default TweetContainer;
