import React, { FC, memo } from 'react';
import TweetType from 'types/Tweet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RetweetWrapper, RetweetText } from './styled';

interface RetweetProps {
  children: JSX.Element[] | JSX.Element;
  tweet: TweetType;
}
export const Retweet: FC<RetweetProps> = ({ children, tweet }) => {
  const { handle } = tweet.user;
  return (
    <RetweetWrapper>
      <RetweetText>
        {' '}
        <FontAwesomeIcon icon="retweet" />
        <p>@{handle} Retweeted</p>
      </RetweetText>
      {children}
    </RetweetWrapper>
  );
};
export default memo(Retweet);
