import styled from 'styled-components';

import { setLightness } from 'polished';

export const StyledTweet = styled('article')`
  width: 100%;
  display: grid;
  grid:
    'avatar . .' 1rem
    'avatar user-bar user-bar' 1fr
    'avatar content content' 1fr
    '  . content content' minmax(min-content, 3fr)
    'tweet-bar tweet-bar tweet-bar' 1fr/1fr 7fr 1fr;
  background: ${props => props.theme.background};
  ${props => props.theme.mixins.border};
  border-top: none;
  border-left: none;
  border-right: none;
`;

export const UserBar = styled('div')`
  grid-area: user-bar;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 0.3rem;
  align-items: end;
`;

export const AvatarContainer = styled('div')`
  ${props => props.theme.mixins.center}
  grid-area: avatar;
`;
export const Username = styled('h3')`
  color: ${props => props.theme.color};
  font-size: 1.4rem;
  font-weight: bold;
`;
export const Handle = styled('h4')`
  color: ${props => setLightness(0.5, props.theme.secondary)};
  font-size: 1.2rem;
`;

export const Time = styled('time')`
  color: ${props => setLightness(0.5, props.theme.secondary)};
  font-size: 1.2rem;
`;

export const ContentContainer = styled('div')`
  grid-area: content;
  padding: 0.5rem 0.5rem 0.5rem;
`;

export const Text = styled('p')`
  font-size: 1.4rem;
  color: ${props => props.theme.color};
`;

export const Img = styled('img')`
  width: 100%;
  object-fit: cover;
`;
