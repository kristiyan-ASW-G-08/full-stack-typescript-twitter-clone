import React, { FC, memo, SyntheticEvent } from 'react';

import TweetType from 'types/Tweet';
import Tweet from 'components/Tweet/index';
import { TweetsWrapper, Select, Tweets } from './styled';

interface TweetProps {
  tweets: TweetType[];
  getTweets: (sort?: string, url?: string) => Promise<void>;
}
export const TweetContainer: FC<TweetProps> = ({ tweets, getTweets }) => {
  const getTweetsHandler = (e: SyntheticEvent) => {
    const target = e.target as HTMLInputElement;
    const value: string = target.value;
    getTweets(value);
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
        {tweets.map(tweet => (
          <Tweet key={tweet._id} tweet={tweet} />
        ))}
      </Tweets>
    </TweetsWrapper>
  );
};
export default TweetContainer;
