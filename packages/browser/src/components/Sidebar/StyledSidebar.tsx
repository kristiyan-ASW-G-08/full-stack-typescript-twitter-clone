import styled from 'styled-components';
import { transparentize, darken, lighten } from 'polished';

interface SidebarProps {
  on: boolean;
}
export const StyledSidebar = styled('aside')<SidebarProps>`
  display:grid;
  grid-template-columns:3fr 1fr;
  ${props => (props.theme.testing ? '' : 'position: fixed;')};
  transform: translateX(-100vw);
  z-index: 15;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: none;
  ${props => props.theme.mixins.slide};
  ${props => (props.on ? `animation: slide 200ms linear forwards` : '')}
  @media ${props => props.theme.mediaQueries.tablet} {
    display:none;
  }
`;

export const Backdrop = styled('div')`
  background: ${props => transparentize(0.5, props.theme.secondary)};
`;

export const Container = styled('div')`
  height: 100%;
  background: ${props => props.theme.background};
`;

export const SidebarHeader = styled('div')`
  width: 100%;
  height: 20%;
  display: grid;
  grid:
    ' . . . ' 1fr
    'logo logo logo ' 3fr
    ' authentication-bar . .' 1fr/1fr 1fr 1fr;
  ${props => props.theme.mixins.border}
`;

export const AuthenticatedSidebarHeader = styled('div')`
  width: 100%;
  height: 20%;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 0.2rem;
  padding-top: 3rem;
  padding-left: 0.5rem;
  ${props => props.theme.mixins.border}
  
  h3 {
    font-size: 1.3rem;
    color: ${props =>
      props.theme.currentTheme === 'light'
        ? props.theme.color
        : props.theme.white};
  }
  h4 {
    font-size: 1.1rem;
    color: ${props => props.theme.secondary};
  }
  button {
    font-size: 1.1rem;
    font-weight: bold;
    background: none;
    ${props => props.theme.mixins.button}
    color: ${props => props.theme.secondary};
    span {
      color: ${props =>
        props.theme.currentTheme === 'light'
          ? darken(0.4, props.theme.secondary)
          : lighten(0.2, props.theme.secondary)};
    }
    margin-right: 0.5rem;
  }
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
  grid-gap: 0.3rem;
  grid-template-columns: repeat(3, auto);
  align-items: center;
  padding-left: 0.5rem;
  max-width: 15rem;
  * {
    font-size: 1.5rem;
    font-weight: bold;
  }
  span {
    display: block;
    text-align: center;
    color: ${props => props.theme.primary};
  }
  button {
    ${props => props.theme.mixins.button}
    background: none;
    color: ${props =>
      props.theme.currentTheme === 'light'
        ? props.theme.color
        : props.theme.white};
  }
`;

export const SidebarBody = styled('div')`
  padding-top: 2rem;
  width: 100%;
  height: 80%;
`;

export const SidebarList = styled('ul')`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 60%;
  margin-bottom: 1rem;
  ${props => props.theme.mixins.border};
  border-top: none;
  border-left: none;
  li {
    width: 10rem;
    margin-top: 1.5rem;
  }
`;

export const SidebarButton = styled('button')`
  margin-left: 0.5rem;
  width:auto;
  display: flex;
  flex-flow: row;
  background:none;
  border: none;
  ${props => props.theme.mixins.button}
  color: ${props =>
    props.theme.currentTheme === 'light'
      ? props.theme.color
      : props.theme.white};
   
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
