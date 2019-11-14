import styled from 'styled-components';

interface TweetsWrapperProps {
  hasBorderRadius?: boolean | undefined;
}
export const TweetsWrapper = styled('section')<TweetsWrapperProps>`
  width: 100vw;
  display: grid;
  grid:
    'feed-bar feed-bar feed-bar' auto
    '. select . ' auto
    'tweets tweets tweets' minmax(90vh, auto)
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
    width: 60rem;
  }
`;
TweetsWrapper.defaultProps = {
  hasBorderRadius: true,
};
export const Tweets = styled('div')`
  grid-area: tweets;
  width: 100%;
`;

export const LoaderWrapper = styled('div')`
  grid-area: loader;
`;
export const SelectWrapper = styled('div')`
  grid-area: select;
`;
