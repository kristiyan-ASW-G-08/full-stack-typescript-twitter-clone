import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { observer } from 'mobx-react-lite';
import { useHistory, useLocation } from 'react-router-dom';
import TweetType from 'types/Tweet';
import Notification from 'types/Notification';
import User from 'types/User';
import axios from 'axios';
import useStores from 'hooks/useStores';
import defaultWarning from 'utilities/defaultWarning';
import updateUserHandler from './utilities/updateUserHandler';
import ShareButton from './ShareButton/index';

import { TweetBarWrapper, TweetBarButton } from './styled';

interface TweetProps {
  tweet: TweetType;

  deleteTweetHandler: (tweetId: string) => void;
}

export const TweetBar: FC<TweetProps> = ({ tweet, deleteTweetHandler }) => {
  const { notificationStore, authStore } = useStores();
  const { token, user } = authStore.authState;
  const location = useLocation();
  const history = useHistory();
  const { _id } = tweet;
  const updateUserEvent = async (urlExtension: string) => {
    await updateUserHandler(
      token,
      urlExtension,
      (notification: Notification) =>
        notificationStore.setNotification(notification),
      (user: User | undefined) => authStore.updateUser(user),
    );
  };
  const notification: Notification = {
    type: 'warning',
    content: 'Log in or Sign up to perform this action!',
  };

  return (
    <>
      <TweetBarWrapper>
        <TweetBarButton
          active={user && user.likes.includes(_id) ? 'like' : undefined}
          data-testid="like-button"
          onClick={async () => {
            if (!user) {
              notificationStore.setNotification(notification);
              return;
            }

            await updateUserEvent(`users/tweets/${_id}/like`);
          }}
        >
          <FontAwesomeIcon icon="heart" />
          <span> {tweet.likes}</span>
        </TweetBarButton>
        <TweetBarButton
          active={user && user.bookmarks.includes(_id) ? 'primary' : undefined}
          data-testid="bookmark-button"
          onClick={async () => {
            if (!user) {
              notificationStore.setNotification(notification);
              return;
            }
            await updateUserEvent(`users/tweets/${_id}/bookmark`);
          }}
        >
          <FontAwesomeIcon icon="bookmark" />
        </TweetBarButton>

        {user && user._id === tweet.user._id ? (
          <>
            <TweetBarButton
              data-testid="delete-button"
              onClick={async () => {
                if (!user) {
                  notificationStore.setNotification(notification);
                  return;
                }
                try {
                  const config = {
                    headers: { Authorization: `bearer ${token}` },
                  };
                  await axios.delete(
                    `${process.env.REACT_APP_API_URL}/tweets/${_id}`,
                    config,
                  );
                  deleteTweetHandler(tweet._id);
                } catch (err) {
                  notificationStore.setNotification(defaultWarning);
                }
              }}
            >
              <FontAwesomeIcon icon="trash" />
            </TweetBarButton>
            <TweetBarButton
              data-testid="edit-button"
              onClick={async () => {
                if (!user) {
                  notificationStore.setNotification(notification);
                  return;
                }
                history.push({
                  pathname: `update/tweet/${_id}`,
                  state: {
                    tweetForm: location,
                    tweet,
                  },
                });
              }}
            >
              <FontAwesomeIcon icon="edit" />
            </TweetBarButton>
          </>
        ) : (
          ''
        )}
        <TweetBarButton
          data-testid="reply-button"
          active={user && user.replies.includes(_id) ? 'primary' : undefined}
          onClick={async () => {
            if (!user) {
              notificationStore.setNotification(notification);
              return;
            }
            history.push({
              pathname: `reply/${_id}`,
              state: {
                tweetForm: location,
              },
            });
          }}
        >
          <FontAwesomeIcon icon="comment" />
          <span>{tweet.replies}</span>
        </TweetBarButton>

        <TweetBarButton
          active={user && user.retweets.includes(_id) ? 'primary' : undefined}
          data-testid="retweet-button"
          onClick={async () => {
            if (!user) {
              notificationStore.setNotification(notification);
              return;
            }
            history.push({
              pathname: `retweet/${_id}`,
              state: {
                tweetForm: location,
              },
            });
          }}
        >
          <FontAwesomeIcon icon="retweet" />
          <span>{tweet.retweets}</span>
        </TweetBarButton>

        <ShareButton
          tweet={tweet}
          setNotification={notificationStore.setNotification}
        />
      </TweetBarWrapper>
    </>
  );
};
export default observer(TweetBar);
