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

export const TextLoader = styled('div')`
  grid-area: loader;
  font-weight: bold;
  text-align: center;
  font-size: 1.7rem;
  color: ${({ theme }) => theme.secondary};
`;
export const Select = styled('select')`
  grid-area: select;
  ${({ theme }) => theme.mixins.button};
  ${({ theme }) => theme.mixins.center};
  display: block;
  text-align: center;
  text-align-last: center;
  background: ${({ theme }) =>
    theme.theme === 'light' ? theme.secondary : theme.light};
  color: ${({ theme }) =>
    theme.theme === 'light' ? theme.light : theme.secondary};
  border-radius: 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  appearance: none;
`;
