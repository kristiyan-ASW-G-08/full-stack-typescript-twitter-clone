import React, { FC, useContext } from 'react';
import { observer } from 'mobx-react-lite';
import Theme from 'components/Theme/Theme';
import NavBar from 'components/Navbar/Navbar';
import RootStoreContext from 'stores/RootStore/RootStore';
import GlobalStyle from 'styled/GlobalStyle';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';

library.add(faBars, faUser, faSearch);
const App: FC = observer(() => {
  const { themeStore, authStore } = useContext(RootStoreContext);
  const { theme } = themeStore;
  return (
    <>
      <GlobalStyle />
      <Theme currentTheme={theme}>
        <NavBar
          theme={theme}
          resetAuthState={() => authStore.resetAuthState()}
          toggleTheme={() => themeStore.toggleTheme()}
          authState={authStore.authState}
        />
      </Theme>
    </>
  );
});

export default App;
