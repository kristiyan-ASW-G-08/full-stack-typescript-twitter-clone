import React from 'react';
import { storiesOf } from '@storybook/react';
import { Logo } from 'components/Logo/Logo';
storiesOf('Logo', module)
  .add('light theme', () => <Logo />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('dark theme', () => <Logo />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  });
