import styled from 'styled-components';

export const TweetPageWrapper = styled('div')`
  margin-top: 1rem;
  display: grid;
  justify-items: center;
  overflow: auto;
  background: ${({ theme }) => theme.background};
  border-radius: 10px;
  @media ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100vw;
  }
  @media ${({ theme }) => theme.mediaQueries.tablet} {
    width: 70vw;
  }
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    width: 60rem;
  }
`;

export const P = styled('p')`
  width: 100%;
  font-size: 1.5rem;
  padding: 1rem;
  text-align: center;
  color: ${({ theme }) => theme.color};
`;
