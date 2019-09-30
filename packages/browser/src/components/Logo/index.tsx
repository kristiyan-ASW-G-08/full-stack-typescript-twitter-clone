import React, { FC } from 'react';
import { ReactComponent as LogoPrimary } from 'assets/logo-primary.svg';
import { LogoWrapper, LogoText, LogoSpan } from './styled';

interface LogoProps {
  type?: 'horizontal' | 'vertical';
}
export const Logo: FC<LogoProps> = ({ type = 'horizontal' }) => {
  return (
    <LogoWrapper type={type}>
      <LogoPrimary />
      <LogoText type={type}>
        <LogoSpan>Twitt</LogoSpan>Clone
      </LogoText>
    </LogoWrapper>
  );
};
export default Logo;
