import React from 'react';
import { storiesOf } from '@storybook/react';
import { Navbar } from 'components/Navbar';
import { defaultAuthState } from 'stores/AuthStore';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';

storiesOf('Navbar', module)
  .add(
    'light theme',
    () => (
      <Navbar
        authState={defaultAuthState}
        theme="light"
        resetAuthState={() => {}}
        toggleTheme={() => {}}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'light theme: authenticated',
    () => (
      <Navbar
        authState={authenticatedAuthState}
        theme="light"
        resetAuthState={() => {}}
        toggleTheme={() => {}}
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
        theme="light"
        resetAuthState={() => {}}
        toggleTheme={() => {}}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  )
  .add(
    'dark theme: authenticated',
    () => (
      <Navbar
        authState={authenticatedAuthState}
        theme="dark"
        resetAuthState={() => {}}
        toggleTheme={() => {}}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
