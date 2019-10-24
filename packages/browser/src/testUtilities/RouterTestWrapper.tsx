import React, { FC } from 'react';
import { Router } from 'react-router-dom';
import { History } from 'history';
import Theme from 'components/Theme/Theme';

interface RouterTestWrapperProps {
  theme?: 'light' | 'dark';
  history: History;
}
const RouterTestWrapper: FC<RouterTestWrapperProps> = ({
  children,
  theme = 'light',
  history,
}) => (
  <Theme currentTheme={theme}>
    <Router history={history}>{children}</Router>
  </Theme>
);

export default RouterTestWrapper;
