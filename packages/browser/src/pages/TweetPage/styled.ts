import styled from 'styled-components';



export const TweetPageWrapper = styled('h1')`
  display: grid;
  justify-items: center;
  overflow: auto;
  background: ${props => props.theme.background};
  border-radius: 10px;

  @media ${props => props.theme.mediaQueries.mobile} {
    width: 100vw;
  }
  @media ${props => props.theme.mediaQueries.tablet} {
    width: 70vw;
  }
  @media ${props => props.theme.mediaQueries.desktop} {
    width: 60rem;
  }
`;

export const P = styled('p')`
  width: 100%;
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;
  color: ${props => props.theme.color};
`;
