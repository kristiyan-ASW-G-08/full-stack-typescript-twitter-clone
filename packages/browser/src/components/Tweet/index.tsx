import React, { FC, memo } from 'react';
import {
  StyledTweet,
  UserBar,
  Username,
  Text,
  ContentContainer,
} from './styled';
import Avatar from 'components/Avatar/index';
import TweetType from 'types/Tweet';
import getTime from 'utilities/getTime';

interface TweetProps {
  tweet: TweetType;
}
export const Tweet: FC<TweetProps> = ({ tweet }) => {
  const { user, text, date } = tweet;
  const { username, handle, avatar } = user;
  const milliseconds = new Date().getTime() - new Date(date).getTime();
  const { hours, days } = getTime(milliseconds);
  return (
    <StyledTweet>
      <Avatar avatarURL={avatar} altText={username} />
      <UserBar>
        <Username>{username}</Username> @{handle} {days} {hours}
      </UserBar>
      <ContentContainer>{text}</ContentContainer>
    </StyledTweet>
  );
};
export default memo(Tweet);
