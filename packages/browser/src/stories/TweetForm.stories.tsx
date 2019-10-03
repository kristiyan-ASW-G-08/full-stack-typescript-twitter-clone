import React from 'react';
import { storiesOf } from '@storybook/react';
import TweetForm from 'components/TweetForm/index';
storiesOf('TweetForm', module)
  .add(
    'light theme',
    () => (
      <TweetForm
        resetModalStore={() => {}}
        setNotification={() => {}}
        token={''}
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
      <TweetForm
        resetModalStore={() => {}}
        setNotification={() => {}}
        token={''}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
