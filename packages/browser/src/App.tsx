import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBars,
  faUser,
  faSearch,
  faHome,
  faMoon,
  faSun,
  faBookmark,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import Router from 'components/Router';
import StyledApp from 'styled/App';
import RootStoreContext from 'stores/RootStore/RootStore';
import Theme from 'components/Theme/Theme';
import GlobalStyle from 'styled/GlobalStyle';

library.add(
  faBars,
  faUser,
  faSearch,
  faHome,
  faMoon,
  faSun,
  faBookmark,
  faSignOutAlt,
);

const App: FC = observer(() => {
  const { theme } = useContext(RootStoreContext).themeStore;
  return (
    <div className="wrapper">
      <GlobalStyle />
      <Theme theme={theme}>
        <StyledApp>
          <Router />
        </StyledApp>
      </Theme>
    </div>
  );
});

export default App;
