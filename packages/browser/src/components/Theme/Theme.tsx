import React, { FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';


interface ThemeProps {
  children: JSX.Element;
  currentTheme: 'light' | 'dark';
}
const light = {
  primary: '#1da1d2',
  secondary: '#657786',
  background: '#ffffff',
  like: '#e0245e',
  white: '#ffffff',
};
const dark = {
  secondary: '#8899a6',
  primary: '#1da1d2',
  background: '#1c2938',
  like: '#e0245e',
  white: '#ffffff',
};

const Theme: FunctionComponent<ThemeProps> = ({ children, currentTheme }) => {
  return currentTheme === 'light' ? (
    <ThemeProvider theme={light}>{children}</ThemeProvider>
  ) : (
    <ThemeProvider theme={dark}>{children}</ThemeProvider>
  );
};

export default Theme;
