import React from 'react';
import { storiesOf } from '@storybook/react';
import StyledInput from 'styled/StyledInput';
storiesOf('StyledInput', module)
  .add(
    'light theme',
    () => (
      <StyledInput>
        <input type="text" placeholder="Placeholder"></input>
        <span>Placeholder is invalid</span>
      </StyledInput>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <StyledInput>
        <input type="text" placeholder="Placeholder"></input>
        <span>Placeholder is invalid</span>
      </StyledInput>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
