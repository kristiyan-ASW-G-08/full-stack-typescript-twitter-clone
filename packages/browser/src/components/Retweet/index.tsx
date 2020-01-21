import React, { FC, memo } from 'react';
import TweetType from 'types/Tweet';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RetweetWrapper, RetweetText } from './styled';

interface RetweetProps {
  children: JSX.Element[] | JSX.Element;
  tweet: TweetType;
}
export const Retweet: FC<RetweetProps> = ({
  children,
  tweet: {
    user: { handle, _id },
  },
}) => (
  <RetweetWrapper>
    <RetweetText>
      <FontAwesomeIcon icon="retweet" />
      <Link to={`/users/${_id}`} data-testid="retweet-profile-link">
        @{handle} Retweeted
      </Link>
    </RetweetText>
    {children}
  </RetweetWrapper>
);

export default memo(Retweet);
