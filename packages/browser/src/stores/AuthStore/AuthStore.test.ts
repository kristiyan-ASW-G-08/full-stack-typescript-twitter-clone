import AuthStore, { defaultAuthState } from 'stores/AuthStore/AuthStore';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
import { when } from 'mobx';

describe('AuthStore', (): void => {
  it('authState should equal defaultAuthState', (): void => {
    expect.assertions(1);
    const authStore = new AuthStore();
    expect(authStore.authState).toEqual(defaultAuthState);
  });
  it('updates authState with the provided user-data and token', (): void => {
    expect.assertions(1);
    const authStore = new AuthStore();
    authStore.setAuthState(authenticatedAuthState);
    expect(authStore.authState).toEqual(authenticatedAuthState);
  });
  it('resets authState', (): void => {
    expect.assertions(1);
    const authStore = new AuthStore();
    authStore.authState = authenticatedAuthState;
    authStore.resetAuthState();
    expect(authStore.authState).toEqual(defaultAuthState);
  });
  it('resets authState automatically', async (): Promise<void> => {
    expect.assertions(2);
    const remainingMilliseconds = 10;
    const authStore = new AuthStore();
    authStore.authState = authenticatedAuthState;
    authStore.initAuthStoreReset(remainingMilliseconds);
    expect(authStore.authState).toEqual(authenticatedAuthState);
    await when(() => authStore.authState.token === '');
    expect(authStore.authState).toEqual(defaultAuthState);
  });
});
