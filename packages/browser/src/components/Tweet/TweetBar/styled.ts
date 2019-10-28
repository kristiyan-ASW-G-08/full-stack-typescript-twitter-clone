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
  ${props => props.theme.mixins.button};
  background: none;
  font-size: 1.5rem;
  height: 100%;
  color: ${props => {
    const color = props.active ? props.theme[props.active] : props.theme.dark;
    return color;
  }};
  padding: 0.5rem 0 0.5rem 0;
`;
