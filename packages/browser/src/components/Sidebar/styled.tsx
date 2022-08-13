import styled, { css } from 'styled-components';

interface SidebarProps {
  isActive: boolean;
}
const header = css`
  width: 100%;
  height: 20%;
  min-height: 15rem;
`;
export const SidebarWrapper = styled('aside')<SidebarProps>`
  display: grid;
  grid-template-columns: 3fr 1fr;
  position: fixed;
  z-index: 3;
  width: 100vw;
  height: 100vh;
  ${({ theme }) => theme.mixins.slide};
  ${({ isActive }) =>
    isActive ? `animation: slide 200ms ease-in forwards` : ''};
  @media (max-height: 30rem) {
    overflow: scroll;
  }
  @media ${({ theme }) => theme.mediaQueries.tablet} {
    grid-template-columns: 2fr 3fr;
  }
  @media ${({ theme }) => theme.mediaQueries.desktop} {
    display: none;
  }
`;

export const Backdrop = styled('div')`
  background: ${({ theme }) => theme.transparentBackground};
`;

export const Container = styled('div')`
  background: ${({ theme }) => theme.background};
`;

export const SidebarHeader = styled('div')`
  ${({ theme }) => theme.mixins.header};
  display: grid;
  grid:
    ' . . . ' 1fr
    'logo logo logo ' 3fr
    ' authentication-bar . .' 1fr/1fr 1fr 1fr;
  ${({ theme }) => theme.mixins.border}
`;

export const AuthenticatedSidebarHeader = styled('div')`
  ${({ theme }) => theme.mixins.header}
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.2rem;
  padding-top: 3rem;
  padding-left: 0.7rem;
  ${({ theme }) => theme.mixins.border}
`;

export const SearchBarWrapper = styled('div')`
  margin-left: 0.7rem;
`;
export const LogoContainer = styled('div')`
  display: grid;
  align-content: center;
  justify-items: center;
  grid-area: logo;
`;

export const AuthenticationBar = styled('div')`
  grid-area: authentication-bar;
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(3, auto);
  align-items: center;
  padding-left: 0.5rem;
  width: 15rem;
  span {
    color: ${({ theme }) => theme.primary};
    font-size: 1.4rem;
  }
`;

export const SidebarBody = styled('div')`
  padding-top: 2rem;
  width: 100%;
  height: 80%;
  min-height: 10rem;
`;

export const SidebarList = styled('ul')`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60%;
  min-height: 30rem;
  margin-bottom: 1rem;
  ${({ theme }) => theme.mixins.border};
  border-top: none;
  border-left: none;
  li {
    width: 10rem;
    margin-top: 1.5rem;
    a {
      display: block;
    }
  }
`;

export const AuthenticationButton = styled('button')`
  ${({ theme }) => theme.mixins.button}
  background:none;
  a {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.color};
  }
`;
export const SidebarButton = styled('button')`
  margin-left: 0.7rem;
  width:auto;
  display: flex;
  flex-flow: row;
  background:none;
  ${({ theme }) => theme.mixins.flexCenter}
  border: none;
  ${({ theme }) => theme.mixins.button}
  color:   ${({ theme }) => theme.color};
   
 
  p {
    display: block;
    font-size: 1.3rem;
  }
  span {
    margin-right: 0.5rem;
    display: block;
    font-size: 1.2rem;
  }
`;
