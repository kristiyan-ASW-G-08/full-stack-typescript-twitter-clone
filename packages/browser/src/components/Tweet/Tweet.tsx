import React, { FC } from 'react';
import { StyledTweet } from './StyledTweet';
import Tweet from 'types/Tweet';

interface TweetProps {
  tweet: Tweet;
}
export const Tweet: FC<TweetProps> = ({ tweet }) => {
  return <StyledTweet />;
};
export default Tweet;
