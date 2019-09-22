import React from 'react';
import { storiesOf } from '@storybook/react';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { defaultAuthState } from 'stores/AuthStore/AuthStore';

storiesOf('Sidebar', module)
  .add(
    'light theme',
    () => (
      <Sidebar
        authState={defaultAuthState}
        theme={'light'}
        resetAuthState={() => {}}
        toggleTheme={() => {}}
        on={true}
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
        authState={defaultAuthState}
        theme={'dark'}
        resetAuthState={() => {}}
        toggleTheme={() => {}}
        on={true}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
