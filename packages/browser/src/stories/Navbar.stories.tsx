import React from 'react';
import { storiesOf } from '@storybook/react';
import { Navbar } from 'components/Navbar';

storiesOf('Navbar', module)
  .add('light theme', () => <Navbar />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('light theme: authenticated', () => <Navbar />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('dark theme', () => <Navbar />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  })
  .add('dark theme: authenticated', () => <Navbar />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  });
