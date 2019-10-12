import React, { FC, memo, useContext, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import {
  TweetWrapper,
  UserBar,
  Username,
  Handle,
  Text,
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
  const { user, text, date, image, link } = tweet;
  const { username, handle, avatar } = user;
  const milliseconds = new Date().getTime() - new Date(date).getTime();
  const { hours, days } = getTime(milliseconds);
  return useMemo(() => {
    return (
      <TweetWrapper>
        <AvatarContainer>
          <Avatar avatarURL={avatar} altText={username} />
        </AvatarContainer>
        <UserBar>
          <Username>{username}</Username> <Handle>@{handle}</Handle>{' '}
          <Time>
            {days}d:{hours}h
          </Time>
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
