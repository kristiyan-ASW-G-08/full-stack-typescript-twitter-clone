import { observable, action, autorun } from 'mobx';
import { persist } from 'mobx-persist';
import Notification from 'types/Notification';

export const defaultNotification: Notification = {
  type: 'message',
  content: '',
};

class NotificationStore {
  @persist('object')
  @observable
  public notification: Notification = defaultNotification;
  @observable public isNotificationActive: boolean = false;
  @action public setNotification(notification: Notification): void {
    this.isNotificationActive = true;
    this.notification = notification;
    autorun(
      () => {
        this.resetNotification();
      },
      { delay: 4000 },
    );
  }
  @action public resetNotification(): void {
    this.isNotificationActive = false;
    this.notification = defaultNotification;
  }
}
export default NotificationStore;
