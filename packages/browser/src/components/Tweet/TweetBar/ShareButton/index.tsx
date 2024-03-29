import React, { FC, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import setClipboard from 'utilities/setClipboard';
import Tweet from 'types/Tweet';
import Notification from 'types/Notification';
import { ShareButtonWrapper, DropDown, DropDownItem } from './styled';
import { TweetBarButton } from '../styled';

interface ShareButtonProps {
  tweet: Tweet;
  setNotification: (notification: Notification) => void;
}
export const ShareButton: FC<ShareButtonProps> = ({
  tweet,
  setNotification,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { _id, text } = tweet;
  const tweetUrl = `${process.env.REACT_APP_API_URL}/tweet/${_id}`;
  return (
    <ShareButtonWrapper>
      <TweetBarButton
        data-testid="share-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon="share-alt" />
      </TweetBarButton>
      {isOpen ? (
        <DropDown>
          <DropDownItem>
            <button
              type="button"
              data-testid="clipboard-button"
              onClick={() => {
                setNotification({
                  type: 'message',
                  content: 'Copied to clipboard!',
                });
                setClipboard(tweetUrl);
              }}
            >
              <FontAwesomeIcon icon="share-alt" /> Link
            </button>
          </DropDownItem>
          <DropDownItem>
            <a
              data-testid="reddit-button"
              style={{ display: 'block' }}
              href={`https://www.reddit.com/submit?url=${tweetUrl}&title=${text}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <FontAwesomeIcon icon={['fab', 'reddit']} /> Reddit
            </a>
          </DropDownItem>
          <DropDownItem>
            <a
              data-testid="twitter-button"
              style={{ display: 'block' }}
              href={`https://twitter.com/intent/tweet?text=${text}&url=${tweetUrl}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              <FontAwesomeIcon icon={['fab', 'twitter']} /> Twitter
            </a>
          </DropDownItem>
          <DropDownItem />
        </DropDown>
      ) : (
        ''
      )}
    </ShareButtonWrapper>
  );
};

export default ShareButton;
