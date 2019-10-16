import { RootStore } from 'stores/RootStore/RootStore';

describe('RootStore', (): void => {
  const rootStore = new RootStore();
  it('authStore should exist', (): void => {
    expect(rootStore.authStore).toBeTruthy();
  });
  it('notificationStore should exist', (): void => {
    expect(rootStore.notificationStore).toBeTruthy();
  });
  it('themeStore should exist', (): void => {
    expect(rootStore.themeStore).toBeTruthy();
  });
  it('modalStore should exist', (): void => {
    expect(rootStore.modalStore).toBeTruthy();
  });
});
