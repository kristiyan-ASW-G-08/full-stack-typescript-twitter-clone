import React, { FC, useContext, useEffect } from 'react';
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
  faFeatherAlt,
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
  faFeatherAlt,
);

const App: FC = observer(() => {
  const { themeStore, authStore } = useContext(RootStoreContext);
  const { theme } = themeStore;
  useEffect(() => {
    const expiryDate = localStorage.getItem('expiryDate');
    if (expiryDate && new Date(expiryDate) <= new Date()) {
      authStore.resetAuthState();
      localStorage.removeItem('expiryDate');
    }
  }, []);
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
