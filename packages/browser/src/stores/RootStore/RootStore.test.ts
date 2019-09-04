import { RootStore } from 'stores/RootStore/RootStore';

describe('RootStore', (): void => {
  const rootStore = new RootStore();
  it('authStore should exist as rootStore property', (): void => {
    expect(rootStore.authStore).toBeTruthy();
  });
});
