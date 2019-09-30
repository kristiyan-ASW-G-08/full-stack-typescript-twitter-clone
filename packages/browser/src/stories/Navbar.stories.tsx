import React from 'react';
import { storiesOf } from '@storybook/react';
import { Navbar } from 'components/Navbar';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';
storiesOf('Navbar', module)
  .add(
    'light theme',
    () => (
      <Navbar
        authState={defaultAuthState}
        theme={'light'}
        resetAuthState={() => {}}
        toggleTheme={() => {}}
        toggleSidebar={() => {}}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <Navbar
        authState={defaultAuthState}
        theme={'light'}
        resetAuthState={() => {}}
        toggleTheme={() => {}}
        toggleSidebar={() => {}}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
