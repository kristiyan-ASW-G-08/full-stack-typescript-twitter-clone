import React from 'react';
import { storiesOf } from '@storybook/react';
import Input from 'styled/Input';
storiesOf('Input', module)
  .add(
    'light theme',
    () => (
      <Input>
        <input type="text" placeholder="Placeholder"></input>
        <span>Placeholder is invalid</span>
      </Input>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <Input>
        <input type="text" placeholder="Placeholder"></input>
        <span>Placeholder is invalid</span>
      </Input>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
