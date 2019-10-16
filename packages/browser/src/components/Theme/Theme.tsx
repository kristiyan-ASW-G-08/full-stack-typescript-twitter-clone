import React, { FunctionComponent } from 'react';
import { ThemeProvider } from 'styled-components';
import mixins from './mixins';
import themes from './themes';

interface ThemeProps {
  children: JSX.Element;
  currentTheme: 'light' | 'dark';
}
const utilities = {
  mediaQueries: {
    mobile: '(max-width:768px)',
    tablet: '(min-width:769px)',
    desktop: '(min-width:1024px)',
  },
  mixins,
};

const Theme: FunctionComponent<ThemeProps> = ({ children, currentTheme }) => {
  const theme = { ...utilities, ...themes[currentTheme], theme: currentTheme };
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Theme;
