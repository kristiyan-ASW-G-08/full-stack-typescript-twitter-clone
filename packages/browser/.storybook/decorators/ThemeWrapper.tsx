import * as React from 'react';
import { makeDecorator } from '@storybook/addons';
import GlobalStyle from '../../src/styled/GlobalStyle';
import { BrowserRouter } from 'react-router-dom';
import Theme from '../../src/components/Theme/Theme';
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
);
const ThemeWrapper = makeDecorator({
  name: 'Wrapper',
  parameterName: 'currentTheme',
  wrapper: (storyFn, context, {}) => {
    //@ts-ignore
    const { currentTheme } = context.parameters.options;
    return (
      <>
        <GlobalStyle />
        <Theme theme={currentTheme}>
          <BrowserRouter>{storyFn(context)}</BrowserRouter>
        </Theme>
      </>
    );
  },
});
export default ThemeWrapper;
