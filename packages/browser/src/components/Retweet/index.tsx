import React, { FC, memo } from 'react';
import TweetType from 'types/Tweet';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RetweetWrapper, RetweetText, RetweetMessageWrapper } from './styled';

interface RetweetProps {
  children: JSX.Element[] | JSX.Element;
  tweet: TweetType;
}
export const Retweet: FC<RetweetProps> = ({
  children,
  tweet: {
    user: { handle, _id },
    text,
  },
}) => (
  <RetweetWrapper>
    <RetweetMessageWrapper>
      <div>
        <FontAwesomeIcon size="lg" icon="retweet" />
        <Link to={`/users/${_id}`} data-testid="retweet-profile-link">
          @{handle} Retweeted
        </Link>
      </div>

      <RetweetText>{text}</RetweetText>
    </RetweetMessageWrapper>
    {children}
  </RetweetWrapper>
);

export default memo(Retweet);
