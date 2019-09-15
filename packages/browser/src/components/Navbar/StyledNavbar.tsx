import styled from 'styled-components';

interface StyledNavbarProps {
  currentTheme?: 'dark' | 'light';
}
const StyledNavbar = styled('nav')<StyledNavbarProps>`
  background-color: ${props => props.theme.background};
`;
export default StyledNavbar;
