import React from 'react';
import { storiesOf } from '@storybook/react';
import { Notification } from 'components/Notification';
import NotificationType from 'types/Notification';

const messageNotification: NotificationType = {
  type: 'message',
  content: 'Message',
};

const warningNotification: NotificationType = {
  type: 'warning',
  content: 'Warning',
};

storiesOf('Notification', module)
  .add(
    'message notification',
    () => <Notification notification={messageNotification} />,
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  )
  .add(
    'warning notification',
    () => <Notification notification={warningNotification} />,
    {
      info: { inline: true },
      options: { currentTheme: 'light' },
    },
  );
