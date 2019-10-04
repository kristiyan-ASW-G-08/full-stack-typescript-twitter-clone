import React, { FC, memo } from 'react';
import { StyledTweetBar, TweetBarButton } from './styled';
import TweetType from 'types/Tweet';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TweetProps {
  tweet: TweetType;
}
export const TweetBar: FC<TweetProps> = ({ tweet }) => {
  return (
    <StyledTweetBar>
      <TweetBarButton>
        <FontAwesomeIcon icon="heart" />
      </TweetBarButton>
      <TweetBarButton>
        <FontAwesomeIcon icon="comment" />
      </TweetBarButton>
      <TweetBarButton>
        <FontAwesomeIcon icon="bookmark" />
      </TweetBarButton>
      <TweetBarButton>
        <FontAwesomeIcon icon="share-alt" />
      </TweetBarButton>
      <TweetBarButton>
        <FontAwesomeIcon icon="retweet" />
      </TweetBarButton>
    </StyledTweetBar>
  );
};
export default memo(TweetBar);
