import NotificationStore from 'stores/NotificationStore';
import activeNotification from 'testUtilities/activeNotification';
import { when } from 'mobx';

describe('NotificationStore', (): void => {
  it('notification should be undefined', (): void => {
    expect.assertions(1);

    const notificationStore = new NotificationStore();

    expect(notificationStore.notification).toBeUndefined();
  });
  it('should equal the provided active notification', async (): Promise<
    void
  > => {
    expect.assertions(2);

    const notificationStore = new NotificationStore();
    notificationStore.setNotification(activeNotification);

    expect(notificationStore.notification).toEqual(activeNotification);
    await when(() => notificationStore.notification === undefined);
    expect(notificationStore.notification).toBeUndefined();
  });
  it('should reset notificationStore.notification', (): void => {
    expect.assertions(1);

    const notificationStore = new NotificationStore();
    notificationStore.resetNotification();

    expect(notificationStore.notification).toBeUndefined();
  });
});
