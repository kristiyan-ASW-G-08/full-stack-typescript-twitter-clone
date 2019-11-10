import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Normalize } from 'styled-normalize';
import { BrowserRouter } from 'react-router-dom';
import Routes from 'components/Routes';
import AppWrapper from 'styled/App';
import RootStoreContext from 'stores/RootStore';
import Theme from 'components/Theme/Theme';
import GlobalStyle from 'styled/GlobalStyle';
import 'importFontAwesome';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <GlobalStyle />
      <Normalize />
      <Theme currentTheme={theme}>
        <React.StrictMode>
          <AppWrapper>
            <BrowserRouter>
              <Routes />
            </BrowserRouter>
          </AppWrapper>
        </React.StrictMode>
      </Theme>
    </>
  );
});

export default App;
