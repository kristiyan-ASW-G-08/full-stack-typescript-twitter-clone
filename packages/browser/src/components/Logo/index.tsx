import React, { FC, memo } from 'react';
// @ts-ignore
import LogoPrimary from 'assets/logo-primary.svg';
import { LogoWrapper, LogoText, LogoSpan } from './styled';

interface LogoProps {
  type?: 'horizontal' | 'vertical';
}
export const Logo: FC<LogoProps> = ({ type = 'horizontal' }) => (
  <LogoWrapper type={type}>
    <img src={LogoPrimary} alt="logo" />
    <LogoText type={type}>
      <LogoSpan>Twitt</LogoSpan>Clone
    </LogoText>
  </LogoWrapper>
);

export default memo(Logo);
