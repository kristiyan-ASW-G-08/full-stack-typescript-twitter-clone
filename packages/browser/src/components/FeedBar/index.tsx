import React, { FC, Dispatch, SetStateAction, memo } from 'react';
import Feed from 'types/Feed';
import { FeedBarWrapper, FeedBarButton } from './styled';

interface FeedBarProps {
  feeds: Feed[];
  setUrl: Dispatch<SetStateAction<string>>;
  currentUrl: string;
}
export const FeedBar: FC<FeedBarProps> = ({ feeds, setUrl, currentUrl }) => (
  <FeedBarWrapper>
    {feeds.map(({ name, url }) => (
      <FeedBarButton
        isActive={currentUrl === url}
        key={url}
        onClick={() => setUrl(url)}
      >
        <span> {name}</span>
      </FeedBarButton>
    ))}
  </FeedBarWrapper>
);

export default memo(FeedBar);
