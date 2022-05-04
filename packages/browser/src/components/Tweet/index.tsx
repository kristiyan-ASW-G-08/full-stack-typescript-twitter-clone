import React, { FC, memo } from 'react';
import { Link as NavLink, useLocation } from 'react-router-dom';
import { AdvancedImage } from '@cloudinary/react';
import Avatar from 'components/Avatar';
import TweetType from 'types/Tweet';
import getTime from 'utilities/getTime';
import TweetBar from './TweetBar';
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
} from './styled';

import cloudinary from '../../cloudinary';

interface TweetProps {
  tweet: TweetType;
  deleteTweetHandler: (tweetId: string) => void;
}
export const Tweet: FC<TweetProps> = ({ tweet, deleteTweetHandler }) => {
  const { user, date, _id, reply, text, link, image } = tweet;
  const location = useLocation();
  const { username, handle, avatar } = user;
  const milliseconds = new Date().getTime() - new Date(date).getTime();
  const { hours, days, minutes } = getTime(milliseconds);
  const tweetImage = cloudinary.image(image).setVersion('1650962083');

  return (
    <TweetWrapper data-testid={_id}>
      <AvatarContainer>
        <NavLink to={`/users/${user._id}`} data-testid="profile-link">
          <Avatar avatar={avatar} altText={username} size="medium" />
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
            Replying to
            <NavLink
              to={{
                pathname: `/tweet/${reply._id}`,
                state: { tweet: location },
              }}
              data-testid="reply-tweet-link"
            >
              @{reply.user.handle}
            </NavLink>{' '}
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
            <AdvancedImage cldImg={tweetImage} alt="" />
          </NavLink>
        ) : (
          ''
        )}
      </ContentContainer>
      <TweetBar
        deleteTweetHandler={tweetId => deleteTweetHandler(tweetId)}
        tweet={tweet}
      />
    </TweetWrapper>
  );
};
export default memo(Tweet);
