import styled from 'styled-components';

export const TweetsWrapper = styled('section')`
  width: 100vw;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  @media ${props => props.theme.mediaQueries.desktop} {
    width: 50vw;
  }
`;
export default TweetsWrapper;
