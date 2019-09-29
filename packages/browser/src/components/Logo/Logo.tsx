import React, { FC } from 'react';
import { ReactComponent as LogoPrimary } from 'assets/logo-primary.svg';
import { StyledLogo, LogoText, LogoSpan } from './StyledLogo';

interface LogoProps {
  type?: 'horizontal' | 'vertical';
}
export const Logo: FC<LogoProps> = ({ type = 'horizontal' }) => {
  return (
    <StyledLogo type={type}>
      <LogoPrimary />
      <LogoText type={type}>
        <LogoSpan>Twitt</LogoSpan>Clone
      </LogoText>
    </StyledLogo>
  );
};
export default Logo;
