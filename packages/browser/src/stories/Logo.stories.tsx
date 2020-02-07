import React from 'react';
import { storiesOf } from '@storybook/react';
import { Logo } from 'components/Logo/index';

storiesOf('Logo', module)
  .add('light theme horizontal(default)', () => <Logo />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('light theme vertical', () => <Logo type="vertical" />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('dark theme horizontal(default)', () => <Logo />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  })
  .add('dark theme vertical', () => <Logo type="vertical" />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  });
