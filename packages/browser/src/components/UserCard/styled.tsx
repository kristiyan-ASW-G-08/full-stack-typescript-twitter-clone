import styled from 'styled-components';

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
  grid-area: img-cover;
  position: relative;
`;
export const HoverContainer = styled('div')`
  position: absolute;
  transform: translateY(6rem);
  ${props => props.theme.mixins.border}
  background: ${props => props.theme.background};
  z-index:2;
  border-radius:0.5rem;
`;
export const CoverBackground = styled('button')`
  width: 100%;
  height: 100%;
  ${props => props.theme.mixins.center};
  ${props => props.theme.mixins.button};
  background: ${props => props.theme.primary};
  font-size: 3rem;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarContainer = styled('button')`
  ${props => props.theme.mixins.button};
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
  color: ${props => props.theme.dark};
  font-weight: bold;
`;
export const Handle = styled('p')`
  grid-area: handle;
  font-size: 1.6rem;
  color: ${props => props.theme.light};
`;

export const FollowBar = styled('div')`
  grid-area: follow-bar;
  display: grid;
  grid-template-columns: repeat(auto-fit, 7rem);
  grid-gap: 1rem;
  color: ${props => props.theme.light};
  p,
  span {
    font-size: 1.4rem;
  }
  span {
    margin-right: 0.3rem;
    color: ${props => props.theme.dark};
  }
`;
