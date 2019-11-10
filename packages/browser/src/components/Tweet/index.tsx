import React, { FC, memo, useContext } from 'react';
import { Link as NavLink, useLocation } from 'react-router-dom';
import Avatar from 'components/Avatar/index';
import TweetType from 'types/Tweet';
import getTime from 'utilities/getTime';
import RootStoreContext from 'stores/RootStore';
import Notification from 'types/Notification';
import User from 'types/User';
import TweetBar from './TweetBar/index';
import {
  TweetWrapper,
  UserBar,
  Username,
  Handle,
  Text,
  Reply,
  ContentContainer,
  AvatarContainer,
  Time,
  Link,
  Img,
} from './styled';

interface TweetProps {
  tweet: TweetType;
  deleteTweetHandler: (tweetId: string) => void;
}
export const Tweet: FC<TweetProps> = ({ tweet, deleteTweetHandler }) => {
  const { authStore, notificationStore } = useContext(RootStoreContext);
  const location = useLocation();
  const { user, text, date, image, link, reply, _id } = tweet;
  const { username, handle, avatar } = user;
  const milliseconds = new Date().getTime() - new Date(date).getTime();
  const { hours, days, minutes } = getTime(milliseconds);
  return (
    <TweetWrapper data-testid={_id}>
      <AvatarContainer>
        <NavLink to={`/users/${user._id}`} data-testid="profile-link">
          <Avatar avatarURL={avatar} altText={username} />
        </NavLink>
      </AvatarContainer>
      <UserBar>
        <Username>{username}</Username> <Handle>@{handle}</Handle>{' '}
        <Time>
          {days <= 0 ? '' : `${days}d:`}
          {hours}h{hours <= 0 ? `:${minutes}m:` : ''}
        </Time>
        {reply ? (
          <Reply>
            Replying to <span>@{reply.user.handle}</span>
          </Reply>
        ) : (
          ''
        )}
      </UserBar>
      <ContentContainer>
        <NavLink
          to={{
            pathname: `/tweet/${tweet._id}`,
            state: { tweet: location },
          }}
        >
          <Text>{text}</Text>
        </NavLink>

        {link ? (
          <Link href={link} target="_blank" rel="noopener noreferrer">
            {link}
          </Link>
        ) : (
          ''
        )}

        {image ? (
          <NavLink
            to={{
              pathname: `/tweet/${tweet._id}`,
              state: { tweet: location },
            }}
          >
            <Img src={image} alt="" />
          </NavLink>
        ) : (
          ''
        )}
      </ContentContainer>
      <TweetBar
        deleteTweetHandler={deleteTweetHandler}
        tweet={tweet}
        authState={authStore.authState}
        setNotification={(notification: Notification): void => {
          notificationStore.setNotification(notification);
        }}
        updateUser={(user: User | undefined): void => {
          authStore.updateUser(user);
        }}
      />
    </TweetWrapper>
  );
};
export default memo(Tweet);
