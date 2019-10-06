import React, { FC, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, IconProp } from '@fortawesome/fontawesome-svg-core';
import axios from 'axios';
import { TweetBarWrapper, TweetBarButton } from './styled';
import TweetType from 'types/Tweet';
import AuthState from 'types/AuthState';
import Notification from 'types/Notification';
import User from 'types/User';
import updatedUser from './actions';
import ShareButton from './ShareButton/index';

interface TweetProps {
  tweet: TweetType;
  authState: AuthState;
  setNotification: (notification: Notification) => void;
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
}) => {
  const { isAuth, token, user } = authState;
  const buttons: ButtonType[] = [
    {
      icon: 'heart',
      event: async () => {
        const user = await updatedUser(
          isAuth,
          token,
          `http://localhost:8090/users/tweets/${tweet._id}/like`,
          setNotification,
        );
        updateUser(user);
      },
      isActive: () => (user.likes.includes(tweet._id) ? 'like' : undefined),
    },
    {
      icon: 'comment',
      event: () => {},
      isActive: () => undefined,
    },
    {
      icon: 'bookmark',
      event: async () => {
        const user = await updatedUser(
          isAuth,
          token,
          `http://localhost:8090/users/tweets/${tweet._id}/bookmark`,
          setNotification,
        );
        updateUser(user);
      },
      isActive: () =>
        user.bookmarks.includes(tweet._id) ? 'primary' : undefined,
    },

    {
      icon: 'retweet',
      event: () => {},
      isActive: () => undefined,
    },
  ];
  return (
    <TweetBarWrapper>
      {buttons.map(button => (
        <TweetBarButton
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
