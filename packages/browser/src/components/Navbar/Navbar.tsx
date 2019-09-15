import React, { FC } from 'react';
import { ReactComponent as LogoPrimary } from 'assets/logo-primary.svg';
import StyledNavbar from './StyledNavbar';
const Navbar: FC = () => {
  return (
    <StyledNavbar currentTheme={'light'}>
      <LogoPrimary />
    </StyledNavbar>
  );
};

export default Navbar;
