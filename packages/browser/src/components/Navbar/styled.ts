import styled from 'styled-components';

export const NavbarWrapper = styled('nav')`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  z-index: 2;
  top: 0;
  width: 100vw;
  padding: 1rem 1.7rem 1rem 1.7rem;
  background: ${({ theme }) => theme.background};
  ${({ theme }) =>
    theme.theme === 'light'
      ? `box-shadow: 3px 0px 4px rgba(  ${{ theme }.theme.dark},0.25)`
      : ''}
`;
export const NavIcon = styled('button')`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.primary};
  ${({ theme }) => theme.mixins.button};
  background: none;
  border: none;
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    display: none;
  }
`;

export const LogoText = styled('h1')`
  font-size: 1rem;
  @media ${({ theme }) => theme.mediaQueries.mobile} {
    display: none;
  }
`;

export const Container = styled('div')`
  display: none;
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    display: grid;
    grid-auto-flow: column;
    grid-gap: 1rem;
  }
`;

export const ThemeButton = styled('button')`
  height: 2.7rem;
  font-size: 1.3rem;
  text-align: center;
  ${({ theme }) => theme.mixins.button}
  background: none;
  color: ${({ theme }) => theme.secondary};
`;

export const AvatarWrapper = styled('button')`
  ${({ theme }) => theme.mixins.button}
  background:transparent;
`;
export const DropDownWrapper = styled('div')``;

export const DropDown = styled('ul')`
  position: absolute;
  transform: translateY(1rem);
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  ${({ theme }) => theme.mixins.border}
  padding:0.5rem;
  width: 12rem;
  list-style: none;
  background: ${({ theme }) => theme.background};
  li {
    width: 10rem;
    margin-top: 1.5rem;
    a {
      display: block;
    }
  }
`;
