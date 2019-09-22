import React, { FunctionComponent, useContext } from 'react';
import { ThemeProvider } from 'styled-components';
import mixins from './mixins';
import { light, dark } from './themes';

interface ThemeProps {
  children: JSX.Element;
  theme: 'light' | 'dark';
}
const utilities = {
  mediaQueries: {
    mobile: '(max-width:768px)',
    tablet: '(min-width:769px)',
    desktop: '(min-width:1024px)',
  },
  mixins,
};

const Theme: FunctionComponent<ThemeProps> = ({ children, theme }) => {
  return theme === 'light' ? (
    <ThemeProvider theme={{ ...utilities, ...light }}>{children}</ThemeProvider>
  ) : (
    <ThemeProvider theme={{ ...utilities, ...dark }}>{children}</ThemeProvider>
  );
};

export default Theme;
