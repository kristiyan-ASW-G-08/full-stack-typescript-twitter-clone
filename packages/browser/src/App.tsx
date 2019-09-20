import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Theme from 'components/Theme/Theme';
import RootStoreContext from 'stores/RootStore/RootStore';
import GlobalStyle from 'styled/GlobalStyle';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import Router from 'components/Router';
import StyledApp from 'styled/App';
library.add(faBars, faUser, faSearch);
const App: FC = observer(() => {
  const { theme } = useContext(RootStoreContext).themeStore;
  return (
    <div className="wrapper">
      <GlobalStyle />
      <Theme currentTheme={theme}>
        <StyledApp>
          <Router />
        </StyledApp>
      </Theme>
    </div>
  );
});

export default App;
