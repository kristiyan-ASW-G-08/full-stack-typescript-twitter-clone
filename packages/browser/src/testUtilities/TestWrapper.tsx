import React, { FC } from 'react';
import { BrowserRouter } from 'react-router-dom';
import Theme from 'components/Theme';

interface TestWrapperProps {
  theme?: 'light' | 'dark';
}
const TestWrapper: FC<TestWrapperProps> = ({ children, theme = 'light' }) => (
  <Theme currentTheme={theme}>
    <BrowserRouter>{children}</BrowserRouter>
  </Theme>
);

export default TestWrapper;
