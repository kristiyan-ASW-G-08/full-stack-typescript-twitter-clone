import { configure, addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars, faUser, faSearch } from '@fortawesome/free-solid-svg-icons';
import ThemeWrapper from './decorators/ThemeWrapper';
import requireContext from 'require-context.macro';

library.add(faBars, faUser, faSearch);
addParameters({
  options: {
    currentTheme: 'light',
  },
});

const req = requireContext('../src', true, /.stories.tsx$/);

function loadStories() {
  addDecorator(ThemeWrapper);
  addDecorator(withInfo);
  req.keys().forEach(req);
}

configure(loadStories, module);
