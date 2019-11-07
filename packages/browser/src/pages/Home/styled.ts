import styled from 'styled-components';

export const HomeWrapper = styled('section')`
  @media ${({ theme }) => theme.mediaQueries.tablet} {
    margin-top: 3rem;
  }
`;

export default HomeWrapper;
