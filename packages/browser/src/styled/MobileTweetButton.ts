import styled from 'styled-components';

export const MobileTweetButton = styled('button')`
  position: fixed;
  z-index: 2;
  transform: translate(85vw, 80vh);
  ${({ theme }) => theme.mixins.button}
  border-radius:100%;
  width: 5rem;
  height: 5rem;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.white};
  font-size: 2rem;
  :hover {
    background: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.primary};
  }
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    display: none;
  }
`;
export default MobileTweetButton;
