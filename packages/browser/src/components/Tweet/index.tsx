import React, { FC, memo, useContext, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
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
  Img,
  Link,
} from './styled';
import TweetBar from './TweetBar/index';
import Avatar from 'components/Avatar/index';
import TweetType from 'types/Tweet';
import getTime from 'utilities/getTime';
import RootStoreContext from 'stores/RootStore/RootStore';
import Notification from 'types/Notification';
import User from 'types/User';
import TweetFormProps from 'types/TweetFormProps';

interface TweetProps {
  tweet: TweetType;
}
export const Tweet: FC<TweetProps> = ({ tweet }) => {
  const { authStore, notificationStore, modalStore } = useContext(
    RootStoreContext,
  );
  const { user, text, date, image, link, reply } = tweet;
  const { username, handle, avatar } = user;
  const milliseconds = new Date().getTime() - new Date(date).getTime();
  const { hours, days, minutes } = getTime(milliseconds);
  return useMemo(() => {
    return (
      <TweetWrapper>
        <AvatarContainer>
          <Avatar avatarURL={avatar} altText={username} />
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
          <Text>{text}</Text>
          {link ? (
            <Link href={link} target="_blank" rel="noopener noreferrer">
              {link}
            </Link>
          ) : (
            ''
          )}
          {image ? <Img src={`http://localhost:8090/${image}`} alt="" /> : ''}
        </ContentContainer>
        <TweetBar
          setModalState={(type: 'tweetForm', payload?: TweetFormProps) =>
            modalStore.setModalState(type, payload)
          }
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
  }, [authStore.authState.user]);
};
export default memo(observer(Tweet));
