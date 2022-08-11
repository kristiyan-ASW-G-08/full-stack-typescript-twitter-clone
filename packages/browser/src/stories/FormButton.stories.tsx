import React from 'react';
import { storiesOf } from '@storybook/react';
import FormButton from 'components/FormButton';

storiesOf('FormButton', module)
  .add('loading', () => <FormButton loading text="Button" />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  })
  .add('not loading', () => <FormButton loading text="Button" />, {
    info: { inline: true },
    options: { currentTheme: 'light' },
  });
