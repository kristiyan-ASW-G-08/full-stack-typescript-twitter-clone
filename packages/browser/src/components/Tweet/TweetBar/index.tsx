import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { TweetBarWrapper, TweetBarButton } from './styled';
import TweetType from 'types/Tweet';
import AuthState from 'types/AuthState';
import Notification from 'types/Notification';
import User from 'types/User';
import getUpdatedUser from './getUpdatedUser';
import ShareButton from './ShareButton/index';
import TweetFormProps from 'types/TweetFormProps';

interface TweetProps {
  tweet: TweetType;
  authState: AuthState;
  setNotification: (notification: Notification) => void;
  setModalState: (type: 'tweetForm', tweetFormProps?: TweetFormProps) => void;
  updateUser: (user: User | undefined) => void;
}
interface ButtonType {
  icon: IconProp;
  event: () => void | Promise<void>;
  isActive: () => 'primary' | 'like' | undefined;
}
export const TweetBar: FC<TweetProps> = ({
  tweet,
  authState,
  setNotification,
  updateUser,
  setModalState,
}) => {
  const { token, user } = authState;
  const { _id } = tweet;
  const buttons: ButtonType[] = [
    {
      icon: 'heart',
      event: async () => {
        const user = await getUpdatedUser(
          token,
          `http://localhost:8090/users/tweets/${_id}/like`,
          setNotification,
        );
        updateUser(user);
      },
      isActive: () => (user && user.likes.includes(_id) ? 'like' : undefined),
    },
    {
      icon: 'comment',
      event: () => setModalState('tweetForm', { replyId: _id, type: 'reply' }),
      isActive: () =>
        user && user.replies.includes(_id) ? 'primary' : undefined,
    },
    {
      icon: 'bookmark',
      event: async () => {
        const user = await getUpdatedUser(
          token,
          `http://localhost:8090/users/tweets/${_id}/bookmark`,
          setNotification,
        );
        updateUser(user);
      },
      isActive: () =>
        user && user.bookmarks.includes(_id) ? 'primary' : undefined,
    },

    {
      icon: 'retweet',
      event: () =>
        setModalState('tweetForm', { retweetedId: _id, type: 'retweet' }),
      isActive: () =>
        user && user.retweets.includes(_id) ? 'primary' : undefined,
    },
  ];
  return (
    <TweetBarWrapper>
      {buttons.map(button => (
        <TweetBarButton
          data-testid={`${button.icon}-button`}
          key={button.icon.toString()}
          onClick={async () => {
            if (!user) {
              const notification: Notification = {
                type: 'warning',
                content: 'Log in or Sign up to perform this action!',
              };
              setNotification(notification);
              return;
            }
            await button.event();
          }}
          active={button.isActive()}
        >
          <FontAwesomeIcon icon={button.icon} />
        </TweetBarButton>
      ))}

      <ShareButton tweet={tweet} setNotification={setNotification} />
    </TweetBarWrapper>
  );
};
export default TweetBar;
