import styled from 'styled-components';
import { setLightness } from 'polished';

interface BorderProps {
  direction?: 'top' | 'bottom' | 'right' | 'left';
}
export const UserCardWrapper = styled('article')<BorderProps>`
  background: ${props => props.theme.background};
  width: 100%;
  height: 30rem;
  display: grid;
  grid:
    'img-cover' 12rem
    'container' 8rem/1fr;
  grid-row-gap: 5rem;
  ${props => props.theme.mixins.border};
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

export const Container = styled('div')`
  grid-area: container;
  display: grid;
  grid-template-columns: minmax(min-content, max-content);
  padding-left: 1.5rem;
`;
export const Username = styled('p')`
  font-size: 2rem;
  color: ${props => {
    const lightness = props.theme.theme === 'light' ? 0.3 : 1;
    return setLightness(lightness, props.theme.color);
  }};
  font-weight: bold;
`;
export const Handle = styled('p')`
  font-size: 1.6rem;
  color: ${props => setLightness(0.6, props.theme.secondary)};
`;

export const FollowBar = styled('div')`
  color: ${props => setLightness(0.6, props.theme.secondary)};
  display: grid;
  grid-template-columns: 1fr 1fr;
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
