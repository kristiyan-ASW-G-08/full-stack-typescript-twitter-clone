import React, { FunctionComponent } from 'react';
import { ThemeProvider, GlobalStyleComponent } from 'styled-components';

interface ThemeProps {
  children: JSX.Element;
  currentTheme: 'light' | 'dark';
}
const light = {
  primary: '#1da1f2',
  secondary: '#657786',
  background: '#ffffff',
  like: '#e0245e',
  color: '#1c2938',
  white: '#ffffff',
  border: '#a0adb8',
};
const dark = {
  secondary: '#8899a6',
  primary: '#1da1f2',
  background: '#1c2938',
  like: '#e0245e',
  color: '#ffffff',
  white: '#ffffff',
  border: '#b7c1c9',
};
const utilities = {
  mediaQueries: {
    mobile: '(max-width:768px)',
    tablet: '(min-width:769px)',
    desktop: '(min-width:1024px)',
  },
};
const Theme: FunctionComponent<ThemeProps> = ({ children, currentTheme }) => {
  console.log({ ...utilities, ...light });
  return currentTheme === 'light' ? (
    <ThemeProvider theme={{ ...utilities, ...light }}>{children}</ThemeProvider>
  ) : (
    <ThemeProvider theme={{ ...utilities, ...dark }}>{children}</ThemeProvider>
  );
};

export default Theme;
