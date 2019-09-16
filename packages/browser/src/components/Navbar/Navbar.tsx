import React, { FC } from 'react';
import { ReactComponent as LogoPrimary } from 'assets/logo-primary.svg';
import StyledNavbar from './StyledNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

const Navbar: FC = () => {
  return (
    <StyledNavbar currentTheme={'light'}>
      <LogoPrimary />
      <FontAwesomeIcon icon={faBars} />
    </StyledNavbar>
  );
};

export default Navbar;
