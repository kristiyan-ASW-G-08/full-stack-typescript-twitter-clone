import styled from 'styled-components';

export const StyledNavbar = styled('nav')`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  padding: 1rem;
  background-color: ${props => props.theme.background};
`;
export const StyledNavIcon = styled('button')`
  display: none;
  @media ${props => props.theme.mediaQueries.mobile} {
    font-size: 2.5rem;
    color: ${props => props.theme.primary};
    display: block;
    ${props => props.theme.mixins.button};
    display: grid;
    background: none;
    display: grid;
    align-content: center;
    justify-items: center;
    border: none;
  }
`;

export const StyledLogoText = styled('h1')`
  font-size: 1rem;
  @media ${props => props.theme.mediaQueries.mobile} {
    display: none;
  }
`;

export const StyledContainer = styled('div')`
  display: grid;
  grid-auto-flow: column;
  grid-gap: 1rem;
  @media ${props => props.theme.mediaQueries.mobile} {
    display: none;
  }
`;

export const StyledThemeButton = styled('button')`
  height: 2.7rem;
  font-size: 1.3rem;
  text-align: center;
  ${props => props.theme.mixins.button}
  background: none;
  color: ${props => props.theme.secondary};
`;
