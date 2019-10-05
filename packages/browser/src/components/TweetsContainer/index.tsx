import React, { FC, memo } from 'react';

import TweetType from 'types/Tweet';
import Tweet from 'components/Tweet/index';
import { TweetsWrapper } from './styled';

interface TweetProps {
  tweets: TweetType[];
}
export const TweetContainer: FC<TweetProps> = ({ tweets }) => {
  return (
    <TweetsWrapper>
      {tweets.map(tweet => (
        <Tweet key={tweet._id} tweet={tweet} />
      ))}
    </TweetsWrapper>
  );
};
export default TweetContainer;

