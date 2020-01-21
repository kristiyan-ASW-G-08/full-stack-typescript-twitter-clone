import { observable, action, autorun } from 'mobx';
import Notification from 'types/Notification';

export const defaultNotification: Notification = {
  type: 'message',
  content: '',
};

const defaultWarning: Notification = {
  type: 'warning',
  content: 'Something went wrong, try again later.',
};

class NotificationStore {
  @observable public notification: Notification | undefined = undefined;

  @action public setNotification(
    notification: Notification = defaultWarning,
  ): void {
    this.notification = notification;
    autorun(
      () => {
        this.resetNotification();
      },
      { delay: 4000 },
    );
  }

  @action public resetNotification(): void {
    this.notification = undefined;
  }
}
export default NotificationStore;
