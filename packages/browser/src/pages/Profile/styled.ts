import styled from 'styled-components';

export const ProfileWrapper = styled('section')`
  @media ${props => props.theme.mediaQueries.desktop} {
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
  @media ${props => props.theme.mediaQueries.tablet} {
    ${props => props.theme.mixins.center}
    background:red;
  }
  @media ${props => props.theme.mediaQueries.desktop} {
    width: auto;
  }
`;

export const TweetsWrapper = styled('div')`
  grid-area: tweets;
  @media ${props => props.theme.mediaQueries.desktopMax} {
    ${props => props.theme.mixins.center};
  }
`;
