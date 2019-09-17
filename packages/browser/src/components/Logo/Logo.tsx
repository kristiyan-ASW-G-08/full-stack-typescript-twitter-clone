import React, { FC } from 'react';
import { ReactComponent as LogoPrimary } from 'assets/logo-primary.svg';
import { StyledLogo, StyledLogoText, StyledLogoSpan } from './StyledLogo';
export const Logo: FC = () => {
  return (
    <StyledLogo>
      <LogoPrimary />
      <StyledLogoText>
        <StyledLogoSpan>Twitt</StyledLogoSpan>Clone
      </StyledLogoText>
    </StyledLogo>
  );
};

export default Logo;
