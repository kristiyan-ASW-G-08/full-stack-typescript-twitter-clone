import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Normalize } from 'styled-normalize';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'components/Routes';
import StyledApp from 'styled/App';
import RootStoreContext from 'stores/RootStore/RootStore';
import Theme from 'components/Theme/Theme';
import GlobalStyle from 'styled/GlobalStyle';
import 'utilities/importFontAwesome.js';

const App: FC = observer(() => {
  const { themeStore, authStore } = useContext(RootStoreContext);
  const { theme } = themeStore;
  useEffect(() => {
    const expiryDate = localStorage.getItem('expiryDate');
    if (expiryDate) {
      const remainingMilliseconds =
        new Date(expiryDate).getTime() - new Date().getTime();
      authStore.initAuthStoreReset(remainingMilliseconds);
    }
  }, []);
  return (
    <>
      <GlobalStyle />
      <Normalize />
      <Theme currentTheme={theme}>
        <StyledApp>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </StyledApp>
      </Theme>
    </>
  );
});

export default App;
