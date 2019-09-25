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
  it('notification should equal the activeNotification', (): void => {
    expect.assertions(1);
    const notificationStore = new NotificationStore();
    notificationStore.setNotification(activeNotification);
    expect(notificationStore.notification).toEqual(activeNotification);
  });
  it('notification should equal defaultNotification after resetNotification is called', (): void => {
    expect.assertions(1);
    const notificationStore = new NotificationStore();
    notificationStore.resetNotification();
    expect(notificationStore.notification).toEqual(defaultNotification);
  });
});
