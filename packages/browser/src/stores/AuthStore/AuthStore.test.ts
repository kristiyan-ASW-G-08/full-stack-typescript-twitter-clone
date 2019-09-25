import AuthStore, { defaultAuthState } from 'stores/AuthStore/AuthStore';
import AuthState from 'types/AuthState';
import authenticatedAuthState from 'testUtilities/authenticatedAuthState';
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
    authStore.resetAuthState();
    expect(authStore.authState).toEqual(defaultAuthState);
  });
});
