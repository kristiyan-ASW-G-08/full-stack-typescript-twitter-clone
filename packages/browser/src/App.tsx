import React, { FC } from 'react';
import './App.css';
import Theme from 'components/Theme/Theme';
import NavBar from 'components/Navbar/Navbar';
const App: FC = () => {
  return (
    <Theme currentTheme="light">
      <div className="App">
        <NavBar />
      </div>
    </Theme>
  );
};

export default App;
