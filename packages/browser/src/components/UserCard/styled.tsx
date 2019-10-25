import styled from 'styled-components';
import { setLightness } from 'polished';

interface BorderProps {
  direction?: 'top' | 'bottom' | 'right' | 'left';
}
export const UserCardWrapper = styled('article')<BorderProps>`
  width: 100%;
  height: 30rem;
  display: grid;
  grid:
    'img-cover' 12rem
    'container' 8rem/1fr;
  grid-row-gap: 2rem;
  ${props => props.theme.mixins.border};
  background: ${props => props.theme.background};
`;

export const Cover = styled('div')`
  width: 100%;
  background: ${props => props.theme.primary};
  grid-area: img-cover;
`;
export const CoverBackground = styled('div')`
  width: 100%;
  height: 100%;
  ${props => props.theme.mixins.center};
  font-size: 3rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarContainer = styled('div')`
  ${props => props.theme.mixins.center};
  width: 8.5rem;
  height: 8.5rem;
  background: ${props => props.theme.white};
  border-radius: 100%;
  transform: translate(1.5rem, -5rem);
`;
export const FollowButtonWrapper = styled('div')`
  grid-area: follow-button;
`;

export const Container = styled('div')`
  grid-area: container;
  display: grid;
  grid:
    '.  follow-button .' 2rem
    'username  .  .' 1fr
    'handle  . .' 1fr
    'follow-bar  . .' 1fr/8fr 3fr 1rem;
  grid-row-gap: 0.7rem;
  padding-left: 1.5rem;
`;
export const Username = styled('p')`
  grid-area: username;
  font-size: 2rem;
  color: ${props => {
    const lightness = props.theme.theme === 'light' ? 0.3 : 1;
    return setLightness(lightness, props.theme.color);
  }};
  font-weight: bold;
`;
export const Handle = styled('p')`
  grid-area: handle;
  font-size: 1.6rem;
  color: ${props => setLightness(0.6, props.theme.secondary)};
`;

export const FollowBar = styled('div')`
  grid-area: follow-bar;
  display: grid;
  grid-template-columns: repeat(auto-fit, 7rem);
  grid-gap: 1rem;
  color: ${props => setLightness(0.6, props.theme.secondary)};
  p,
  span {
    font-size: 1.4rem;
  }
  span {
    margin-right: 0.3rem;
    color: ${props => {
      const lightness = props.theme.theme === 'light' ? 0.3 : 0.8;
      return setLightness(lightness, props.theme.secondary);
    }};
  }
`;
