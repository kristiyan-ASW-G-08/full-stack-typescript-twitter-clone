import React, { FC, memo } from 'react';
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

interface TweetProps {
  tweet: TweetType;
}
export const Tweet: FC<TweetProps> = ({ tweet }) => {
  const { user, text, date, image, link } = tweet;
  const { username, handle, avatar } = user;
  const milliseconds = new Date().getTime() - new Date(date).getTime();
  const { hours, days } = getTime(milliseconds);
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
      <TweetBar tweet={tweet} />
    </TweetWrapper>
  );
};
export default memo(Tweet);
