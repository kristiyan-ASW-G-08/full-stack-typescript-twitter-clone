import styled from 'styled-components';

export const FeedBarWrapper = styled('div')`
  background: ${props => props.theme.background};
  grid-area: feed-bar;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
`;

interface FeedBarButtonProps {
  isActive: boolean;
}
export const FeedBarButton = styled('button')<FeedBarButtonProps>`
  ${props => props.theme.mixins.button};
  color: ${props => props.theme.primary};
  background: none;
  span {
    font-size: 1.5rem;
    ${props =>
      props.isActive ? `border-bottom:solid 2px ${props.theme.primary}` : ''}
  }
`;
