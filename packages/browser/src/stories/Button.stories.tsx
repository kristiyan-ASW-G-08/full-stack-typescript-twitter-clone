import React from 'react';
import { storiesOf } from '@storybook/react';
import { Button } from 'styled/Button';
storiesOf('Button', module)
  .add('primary', () => <Button buttonType={'primary'}>Button</Button>, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add(
    'secondary - light theme',
    () => <Button buttonType={'secondary'}>Button</Button>,
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'secondary - dark theme',
    () => <Button buttonType={'secondary'}>Button</Button>,
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
