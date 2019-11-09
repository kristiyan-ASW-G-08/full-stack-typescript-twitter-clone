import React from 'react';
import { storiesOf } from '@storybook/react';
import { Select } from 'styled/Select';

storiesOf('Select', module)
  .add(
    'light theme',
    () => (
      <Select>
        <option value="new">New</option>
        <option value="top">Top</option>
      </Select>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <Select>
        <option value="new">New</option>
        <option value="top">Top</option>
      </Select>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
