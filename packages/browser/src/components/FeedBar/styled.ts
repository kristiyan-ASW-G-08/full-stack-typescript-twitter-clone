import styled from 'styled-components';

export const FeedBarWrapper = styled('div')`
  background: ${({ theme }) => theme.background};
  grid-area: feed-bar;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(1rem, 1fr));
`;

interface FeedBarButtonProps {
  isActive: boolean;
}
export const FeedBarButton = styled('button')<FeedBarButtonProps>`
  ${({ theme }) => theme.mixins.button};
  color: ${({ theme }) => theme.primary};
  background: none;
  span {
    font-size: 1.5rem;
    ${({ isActive, theme }) =>
      isActive ? `border-bottom:solid 2px ${theme.primary}` : ''}
  }
`;
