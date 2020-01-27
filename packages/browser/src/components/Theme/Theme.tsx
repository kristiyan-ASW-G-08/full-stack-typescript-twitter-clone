import React, { FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import mixins from './mixins';
import themes from './themes';
import mediaQueries from './mediaQueries';

interface ThemeProps {
  children: JSX.Element;
  currentTheme: 'light' | 'dark';
}
const utilities = {
  mediaQueries,
  mixins,
};

const Theme: FunctionComponent<ThemeProps> = ({ children, currentTheme }) => {
  const theme = { ...utilities, ...themes[currentTheme] };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
