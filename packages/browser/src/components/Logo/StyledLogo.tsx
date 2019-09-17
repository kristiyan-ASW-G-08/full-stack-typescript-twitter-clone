import styled from 'styled-components';

export const StyledLogo = styled('div')`
  display: grid;
  width: 10rem;
  grid-template-columns: auto auto;
  grid-gap: 0.5rem;
  align-content: center;
`;
export const StyledLogoText = styled('h1')`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.primary};
  @media ${props => props.theme.mediaQueries.mobile} {
    display: none;
  }
`;

export const StyledLogoSpan = styled('span')`
  font-size: 2rem;
  color: ${props => props.theme.color};
`;
