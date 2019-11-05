import styled from 'styled-components';

export const TweetBarWrapper = styled('div')`
  grid-area: tweet-bar;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
`;

interface TweetBarButtonProps {
  active?: 'primary' | 'like' | undefined;
}
export const TweetBarButton = styled('button')<TweetBarButtonProps>`
  ${({ theme }) => theme.mixins.button};
  background: none;
  font-size: 1.5rem;
  height: 100%;
  color: ${({ active, theme }) => {
    const color = active ? theme[active] : theme.dark;
    return color;
  }};
  padding: 0.5rem 0 0.5rem 0;
`;
