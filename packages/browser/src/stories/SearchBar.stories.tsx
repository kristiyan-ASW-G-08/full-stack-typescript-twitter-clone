import React from 'react';
import { storiesOf } from '@storybook/react';
import { SearchBar } from 'components/SearchBar';

storiesOf('SearchBar', module)
  .add('light theme', () => <SearchBar />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('dark theme', () => <SearchBar />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  });
