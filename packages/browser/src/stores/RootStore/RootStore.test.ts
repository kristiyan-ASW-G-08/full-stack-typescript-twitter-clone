import { RootStore } from 'stores/RootStore/RootStore';

describe('RootStore', (): void => {
  const rootStore = new RootStore();
  it('authStore should exist', (): void => {
    expect.assertions(1);
    expect(rootStore.authStore).toBeTruthy();
  });
  it('notificationStore should exist', (): void => {
    expect.assertions(1);
    expect(rootStore.notificationStore).toBeTruthy();
  });
  it('themeStore should exist', (): void => {
    expect.assertions(1);
    expect(rootStore.themeStore).toBeTruthy();
  });
});
