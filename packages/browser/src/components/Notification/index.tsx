import React, { FC } from 'react';

import NotificationType from 'types/Notification';
import { NotificationWrapper, NotificationContent } from './styled';

interface NotificationProps {
  notification: NotificationType;
}
export const Notification: FC<NotificationProps> = ({ notification }) => {
  const { type, content } = notification;
  return (
    <NotificationWrapper>
      <NotificationContent notificationType={type} role="alert">
        {content}
      </NotificationContent>
    </NotificationWrapper>
  );
};

export default Notification;
