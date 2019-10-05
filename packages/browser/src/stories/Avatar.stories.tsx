import React from 'react';
import { storiesOf } from '@storybook/react';
import { Avatar } from 'components/Avatar/index';
import Logo from 'assets/logo-primary.svg';

storiesOf('Avatar', module)
  .add('light theme - default avatar', () => <Avatar />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('light theme - custom avatar', () => <Avatar avatarURL={Logo} />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add(
    'light theme - default avatar - large size',
    () => <Avatar size={'large'} />,
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'light theme - custom avatar - large size',
    () => <Avatar avatarURL={Logo} size={'large'} />,
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add('dark theme - default avatar', () => <Avatar />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  })
  .add('dark theme - custom avatar', () => <Avatar avatarURL={Logo} />, {
    info: { inline: true },
    options: { currentTheme: 'dark' },
  })
  .add(
    'dark theme - default avatar - large size',
    () => <Avatar size={'large'} />,
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  )
  .add(
    'dark theme - custom avatar - large size',
    () => <Avatar avatarURL={Logo} size={'large'} />,
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
