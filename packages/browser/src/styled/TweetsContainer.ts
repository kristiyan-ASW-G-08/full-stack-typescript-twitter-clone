import styled from 'styled-components';

export const TweetsContainer = styled('section')`
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    width: 50vw;
  }
`;
export default TweetsContainer;
