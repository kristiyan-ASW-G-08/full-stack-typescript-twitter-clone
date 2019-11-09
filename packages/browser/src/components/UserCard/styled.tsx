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
  ${({ theme }) => theme.mixins.border};
  background: ${({ theme }) => theme.background};
`;

export const Cover = styled('div')`
  width: 100%;
  grid-area: img-cover;
`;

export const CoverBackground = styled('div')`
  width: 100%;
  height: 100%;
  ${({ theme }) => theme.mixins.center};
  background: ${({ theme }) => theme.primary};
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarContainer = styled('div')`
  ${({ theme }) => theme.mixins.center};
  width: 8.5rem;
  height: 8.5rem;
  background: ${({ theme }) => theme.white};
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
    '.  follow-button .' 2em
    'credentials  .  .' 1fr/8fr 3fr 1rem;
  grid-row-gap: 0.7rem;
  padding-left: 1.5rem;
`;

export const CredentialsContainer = styled('div')`
  grid-area: credentials;
`;
