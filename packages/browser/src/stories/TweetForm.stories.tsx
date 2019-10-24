import React from 'react';
import { storiesOf } from '@storybook/react';
import TweetForm from 'components/TweetForm/index';
import TweetFormProps from 'types/TweetFormProps';

const tweetFormProps: TweetFormProps = {};
storiesOf('TweetForm', module)
  .add(
    'light theme',
    () => (
      //@ts-ignore
      <TweetForm
        tweetFormProps={tweetFormProps}
        resetModalState={() => {}}
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
      //@ts-ignore
      <TweetForm
        tweetFormProps={tweetFormProps}
        resetModalState={() => {}}
        setNotification={() => {}}
        token={''}
      />
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );

export default {};
