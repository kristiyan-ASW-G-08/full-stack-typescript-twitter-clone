import React from 'react';
import { storiesOf } from '@storybook/react';
import TweetForm from 'components/TweetForm/index';
import ModalPayload from 'types/ModalPayload';

const payload: ModalPayload = {};
storiesOf('TweetForm', module)
  .add(
    'light theme',
    () => (
      <TweetForm
        payload={payload}
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
        payload={payload}
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
