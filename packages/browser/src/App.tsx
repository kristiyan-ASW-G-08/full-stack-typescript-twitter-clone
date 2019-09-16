import React, { FC, useContext } from 'react';
import './App.css';
import Theme from 'components/Theme/Theme';
import NavBar from 'components/Navbar/Navbar';
import RootStoreContext from 'stores/RootStore/RootStore';
const App: FC = () => {
  const { authStore, themeStore } = useContext(RootStoreContext);
  const { theme } = themeStore;
  return (
    <Theme currentTheme={theme}>
      <div className="App">
        <NavBar />
      </div>
    </Theme>
  );
};

export default App;
