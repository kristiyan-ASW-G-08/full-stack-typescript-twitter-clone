import styled from 'styled-components';
import { setLightness } from 'polished';

export const TweetWrapper = styled('article')`
  width: 100%;
  display: grid;
  grid:
    'avatar user-bar user-bar ' auto
    'avatar . .' 0.3rem
    '  .   content content'
    'tweet-bar tweet-bar tweet-bar ' 1fr/1fr 7fr 1fr;
  grid-row-gap: 0.3rem;
  background: ${props => props.theme.background};
  ${props => props.theme.mixins.border};
  border-top: none;
  border-left: none;
  border-right: none;
  padding: 1rem 0 1rem;
`;

export const UserBar = styled('div')`
  grid-area: user-bar;
  display: grid;
  grid:
    'username handle time' auto
    'reply reply .' auto/1fr 1fr 1fr;
  grid-gap: 0.5rem;
  align-items: end;
  @media ${props => props.theme.mediaQueries.desktop} {
    grid:
      'username handle time .' auto
      'reply reply . . ' auto/1fr 1fr 1fr 2fr;
  }
`;

export const AvatarContainer = styled('div')`
  ${props => props.theme.mixins.center}
  grid-area: avatar;
`;
export const Username = styled('h3')`
  grid-area: username;
  color: ${props => props.theme.color};
  font-size: 1.4rem;
  font-weight: bold;
`;
export const Handle = styled('h4')`
  grid-area: handle;
  color: ${props => setLightness(0.5, props.theme.secondary)};
  font-size: 1.2rem;
`;

export const Time = styled('time')`
  grid-area: time;
  color: ${props => setLightness(0.5, props.theme.secondary)};
  font-size: 1.2rem;
`;

export const ContentContainer = styled('div')`
  grid-area: content;
  width: 100%;
  * {
    margin-bottom: 0.5rem;
    width: 90%;
    font-size: 1.4rem;
  }
`;

export const Text = styled('p')`
  display: block;
  color: ${props => props.theme.color};
  overflow-wrap: break-word;
`;

export const Reply = styled('p')`
  grid-area: reply;
  display: block;
  color: ${props => props.theme.secondary};
  font-size: 1.2rem;
  span {
    color: ${props => props.theme.primary};
    font-size: inherit;
  }
`;

export const Link = styled('a')`
  display: block;
  color: ${props => props.theme.primary};
`;
export const Img = styled('img')`
  height: 15rem;
  object-fit: cover;
  border-radius: 1rem;
`;
