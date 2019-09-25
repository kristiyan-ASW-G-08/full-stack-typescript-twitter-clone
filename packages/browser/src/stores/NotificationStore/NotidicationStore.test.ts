import NotificationStore, {
  defaultNotification,
} from 'stores/NotificationStore/NotificationStore';
import activeNotification from 'testUtilities/activeNotification';

describe('NotificationStore', (): void => {
  it('notification should equal defaultNotification', (): void => {
    expect.assertions(1);
    const notificationStore = new NotificationStore();
    expect(notificationStore.notification).toEqual(defaultNotification);
  });
  it('should equal the provided active notification', (): void => {
    expect.assertions(1);
    const notificationStore = new NotificationStore();
    notificationStore.setNotification(activeNotification);
    expect(notificationStore.notification).toEqual(activeNotification);
  });
  it('should reset notificationStore.notification', (): void => {
    expect.assertions(1);
    const notificationStore = new NotificationStore();
    notificationStore.resetNotification();
    expect(notificationStore.notification).toEqual(defaultNotification);
  });
});
