import React from 'react';
import { storiesOf } from '@storybook/react';
import { Loader } from 'styled/Loader';
storiesOf('Loader', module)
  .add('light theme', () => <Loader />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('dark theme', () => <Loader />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  });
