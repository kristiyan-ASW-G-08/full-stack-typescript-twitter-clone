import styled from 'styled-components';

export const MobileTweetButton = styled('button')`
  position: fixed;
  z-index: 2;
  transform: translate(85vw, 80vh);
  ${props => props.theme.mixins.button}
  border-radius:100%;
  width: 5rem;
  height: 5rem;
  background: ${props => props.theme.primary};
  color: ${props => props.theme.white};
  font-size: 2rem;
  :hover {
    background: ${props => props.theme.white};
    color: ${props => props.theme.primary};
  }
  @media ${props => props.theme.mediaQueries.desktop} {
    display: none;
  }
`;
export default MobileTweetButton;
