import React, { FC } from 'react';
import { ReactComponent as LogoPrimary } from 'assets/logo-primary.svg';
import { StyledLogo, StyledLogoText, StyledLogoSpan } from './StyledLogo';

interface LogoProps {
  type?: 'horizontal' | 'vertical';
}
export const Logo: FC<LogoProps> = ({ type = 'horizontal' }) => {
  return (
    <StyledLogo type={type}>
      <LogoPrimary />
      <StyledLogoText type={type}>
        <StyledLogoSpan>Twitt</StyledLogoSpan>Clone
      </StyledLogoText>
    </StyledLogo>
  );
};
export default Logo;
