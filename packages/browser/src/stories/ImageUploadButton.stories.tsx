import React from 'react';
import { storiesOf } from '@storybook/react';
import ImageUploadButton from 'components/ImageUploadButton';

storiesOf('ImageUploadButton', module)
  .add(
    'light theme',
    () => (
      <div style={{ width: '300px', textAlign: 'center' }}>
        <ImageUploadButton
          name="username"
          buttonText="Upload photo"
          setFieldValue={() => {}}
        />
      </div>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'dark theme',
    () => (
      <div style={{ width: '300px', textAlign: 'center' }}>
        <ImageUploadButton
          name="username"
          buttonText="Upload photo"
          setFieldValue={() => {}}
        />
      </div>
    ),
    {
      info: { inline: true },
      options: { currentTheme: 'dark' },
    },
  );
