import styled from 'styled-components';

export const ProfileWrapper = styled('section')`
  margin-top: 7vh;
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    padding-top: 2rem;
    display: grid;
    grid:
      '. user-card tweets . ' auto
      '. . tweets . ' auto/2rem 2fr 7fr 3rem;
    grid-gap: 10rem;
  }
`;

export const UserCardWrapper = styled('div')`
  grid-area: user-card;
  @media ${({ theme }) => theme.mediaQueries.tablet} {
    ${({ theme }) => theme.mixins.center}
    background:red;
  }
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    width: auto;
  }
`;

export const TweetsWrapper = styled('div')`
  grid-area: tweets;
  @media ${({ theme }) => theme.mediaQueries.desktopMax} {
    ${({ theme }) => theme.mixins.center};
  }
`;
