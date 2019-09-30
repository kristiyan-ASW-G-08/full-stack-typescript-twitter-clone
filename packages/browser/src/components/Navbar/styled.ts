import styled from 'styled-components';

export const NavbarWrapper = styled('nav')`
  display: flex;
  justify-content: space-between;
  width: 100vw;
  padding: 1rem;
  background-color: ${props => props.theme.background};
`;
export const NavIcon = styled('button')`
  font-size: 2.5rem;
  color: ${props => props.theme.primary};
  ${props => props.theme.mixins.button};
  display: grid;
  background: none;
  align-content: center;
  justify-items: center;
  border: none;
  @media ${props => props.theme.mediaQueries.desktop} {
    display: none;
  }
`;

export const LogoText = styled('h1')`
  font-size: 1rem;
  @media ${props => props.theme.mediaQueries.mobile} {
    display: none;
  }
`;

export const Container = styled('div')`
  display: none;
  @media ${props => props.theme.mediaQueries.desktop} {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 1rem;
  }
`;

export const ThemeButton = styled('button')`
  height: 2.7rem;
  font-size: 1.3rem;
  text-align: center;
  ${props => props.theme.mixins.button}
  background: none;
  color: ${props => props.theme.secondary};
`;
