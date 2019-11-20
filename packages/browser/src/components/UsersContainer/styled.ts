import styled from 'styled-components';

interface UsersWrapperProps {
  hasBorderRadius?: boolean | undefined;
}
export const UsersWrapper = styled('section')<UsersWrapperProps>`
  width: 100vw;
  display: grid;
  grid:
    'feed-bar feed-bar feed-bar' auto
    'users users users' minmax(90vh, auto)
    'loader loader loader' auto/
    0.1rem 5rem 1fr;
  grid-gap: 1rem;
  padding-top: 1rem;
  background: ${({ theme }) => theme.background};
  @media ${({ theme }) => theme.mediaQueries.tablet} {
    width: 80vw;
    margin-top: 1rem;
    ${({ theme }) => theme.mixins.border}
    ${({ hasBorderRadius }) => (hasBorderRadius ? `border-radius:1rem` : '')};
  }
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    width: 100rem;
  }
`;
UsersWrapper.defaultProps = {
  hasBorderRadius: true,
};
export const Users = styled('section')`
  grid-area: users;
  width: 100%;
  padding: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  grid-gap: 1rem;
`;

export const Center = styled('div')`
  width: inherit;
  text-align: center;
`;
