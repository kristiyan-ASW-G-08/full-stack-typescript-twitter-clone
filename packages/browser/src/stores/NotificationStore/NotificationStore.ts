import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import Notification from 'types/Notification';

export const defaultNotification: Notification = {
  type: 'message',
  content: '',
  isActive: false,
};

class NotificationStore {
  @persist('object')
  @observable
  public notification: Notification = defaultNotification;
  @action public setNotification(notification: Notification): void {
    this.notification = notification;
  }
  @action public resetNotification(): void {
    this.notification = defaultNotification;
  }
}
export default NotificationStore;
