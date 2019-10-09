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
  faImage,
  faLink,
  faUserCircle,
  faHeart,
  faShareAlt,
  faRetweet,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { faReddit, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { Normalize } from 'styled-normalize';
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
  faImage,
  faLink,
  faUserCircle,
  faBookmark,
  faHeart,
  faShareAlt,
  faRetweet,
  faBookmark,
  faComment,
  faReddit,
  faTwitter,
);

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
      <Theme theme={theme}>
        <StyledApp>
          <Router />
        </StyledApp>
      </Theme>
    </>
  );
});

export default App;
