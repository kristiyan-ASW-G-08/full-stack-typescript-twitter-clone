import React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from 'components/Sidebar';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';

storiesOf('Sidebar', module)
  .add(
    'light theme',
    () => (
      <Sidebar
        toggleSidebar={() => {}}
        authState={defaultAuthState}
        theme={'light'}
        resetAuthState={() => {}}
        toggleTheme={() => {}}
        isActive={true}
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
      <Sidebar
        toggleSidebar={() => {}}
        authState={defaultAuthState}
        theme={'dark'}
        resetAuthState={() => {}}
        toggleTheme={() => {}}
        isActive={true}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
