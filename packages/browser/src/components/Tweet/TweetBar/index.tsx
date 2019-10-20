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
import axios from 'axios';

interface TweetProps {
  tweet: TweetType;
  authState: AuthState;
  setNotification: (notification: Notification) => void;
  setModalState: (type: 'tweetForm', tweetFormProps?: TweetFormProps) => void;
  updateUser: (user: User | undefined) => void;
  deleteTweetHandler: (tweetId: string) => void;
}
interface ButtonType {
  icon: IconProp;
  event: () => void | Promise<void>;
  isActive: () => 'primary' | 'like' | undefined;
  show: boolean;
}
export const TweetBar: FC<TweetProps> = ({
  tweet,
  authState,
  setNotification,
  updateUser,
  setModalState,
  deleteTweetHandler,
}) => {
  const { token, user } = authState;
  const { _id } = tweet;
  const buttons: ButtonType[] = [
    {
      show: true,
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
      show: true,
      icon: 'comment',
      event: () => setModalState('tweetForm', { replyId: _id, type: 'reply' }),
      isActive: () =>
        user && user.replies.includes(_id) ? 'primary' : undefined,
    },
    {
      show: true,
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
      show: true,
      icon: 'retweet',
      event: () =>
        setModalState('tweetForm', { retweetedId: _id, type: 'retweet' }),
      isActive: () =>
        user && user.retweets.includes(_id) ? 'primary' : undefined,
    },
    {
      show: user && user._id === tweet.user._id ? true : false,
      icon: 'trash',
      event: async () => {
        try {
          const config = {
            headers: { Authorization: 'bearer ' + token },
          };
          await axios.delete(`http://localhost:8090/tweets/${_id}`, config);
          deleteTweetHandler(tweet._id);
        } catch (err) {
          const notification: Notification = {
            type: 'warning',
            content: 'There was an error. Please try again later.',
          };
          setNotification(notification);
        }
      },
      isActive: () => undefined,
    },
    {
      show: user && user._id === tweet.user._id ? true : false,
      icon: 'edit',
      event: () => setModalState('tweetForm', { tweet, type: tweet.type }),
      isActive: () => undefined,
    },
  ];
  return (
    <TweetBarWrapper>
      {buttons.map(button => {
        return button.show ? (
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
        ) : (
          ''
        );
      })}

      <ShareButton tweet={tweet} setNotification={setNotification} />
    </TweetBarWrapper>
  );
};
export default TweetBar;
