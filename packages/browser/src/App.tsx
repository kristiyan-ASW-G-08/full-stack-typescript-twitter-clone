import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Theme from 'components/Theme/Theme';
import RootStoreContext from 'stores/RootStore/RootStore';
import GlobalStyle from 'styled/GlobalStyle';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import Router from 'components/Router';

library.add(faBars, faUser, faSearch);
const App: FC = observer(() => {
  const { theme } = useContext(RootStoreContext).themeStore;
  return (
    <>
      <GlobalStyle />
      <Theme currentTheme={theme}>
        <Router />
      </Theme>
    </>
  );
});

export default App;
