import React, { FC } from 'react';

import NotificationType from 'types/Notification';
import { StyledNotification, NotificationContent } from './StyledNotification';

interface NotificationProps {
  notification: NotificationType;
}
export const Notification: FC<NotificationProps> = ({ notification }) => {
  const { type, content } = notification;
  return (
    <StyledNotification>
      <NotificationContent notificationType={type}>
        {content}
      </NotificationContent>
    </StyledNotification>
  );
};

export default Notification;
