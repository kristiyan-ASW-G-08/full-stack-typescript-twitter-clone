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
import ModalPayload from 'types/ModalPayload';

interface TweetProps {
  tweet: TweetType;
  authState: AuthState;
  setNotification: (notification: Notification) => void;
  setModalState: (type: 'tweetForm', payload?: ModalPayload) => void;
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
  const { isAuth, token, user } = authState;
  const { _id } = tweet;
  const buttons: ButtonType[] = [
    {
      icon: 'heart',
      event: async () => {
        const user = await getUpdatedUser(
          isAuth,
          token,
          `http://localhost:8090/users/tweets/${_id}/like`,
          setNotification,
        );
        updateUser(user);
      },
      isActive: () => (user.likes.includes(_id) ? 'like' : undefined),
    },
    {
      icon: 'comment',
      event: () => setModalState('tweetForm', { replyId: _id, type: 'reply' }),
      isActive: () => undefined,
    },
    {
      icon: 'bookmark',
      event: async () => {
        const user = await getUpdatedUser(
          isAuth,
          token,
          `http://localhost:8090/users/tweets/${_id}/bookmark`,
          setNotification,
        );
        updateUser(user);
      },
      isActive: () => (user.bookmarks.includes(_id) ? 'primary' : undefined),
    },

    {
      icon: 'retweet',
      event: () =>
        setModalState('tweetForm', { retweetedId: _id, type: 'retweet' }),
      isActive: () => undefined,
    },
  ];
  return (
    <TweetBarWrapper>
      {buttons.map(button => (
        <TweetBarButton
          data-testid={`${button.icon}-button`}
          key={button.icon.toString()}
          onClick={async () => await button.event()}
          active={button.isActive()}
        >
          <FontAwesomeIcon icon={button.icon} />
        </TweetBarButton>
      ))}

      <ShareButton tweet={tweet} setNotification={setNotification} />
    </TweetBarWrapper>
  );
};
export default memo(TweetBar);
