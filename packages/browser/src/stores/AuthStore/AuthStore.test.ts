import AuthStore, { defaultAuthState } from 'stores/AuthStore/AuthStore';
import AuthState from 'types/AuthState';
describe('AuthStore', (): void => {
  const authenticatedAuthState: AuthState = {
    isAuth: true,
    user: {
      username: 'mockUserName',
      handle: 'mockUserHandle',
      email: 'mockUserEmail@mail.com',
      profilePhoto: 'default',
      headerPhoto: 'default',
      date: 'mockDate',
      website: 'mockWebsite',
      followers: 0,
      following: [],
      likes: [],
      bookmarks: [],
    },
    token: 'mockToken',
  };
  it('authState should equal defaultAuthStat', (): void => {
    const authStore = new AuthStore();
    expect(authStore.authState).toEqual(defaultAuthState);
  });
  it('authState should be updated with the provided user-data and token', (): void => {
    const authStore = new AuthStore();
    authStore.setAuthState(authenticatedAuthState);
    expect(authStore.authState).toEqual(authenticatedAuthState);
  });
  it('authState should equal defaultAuthState after resetAuthState is called', (): void => {
    const authStore = new AuthStore();
    authStore.resetAuthState();
    expect(authStore.authState).toEqual(defaultAuthState);
  });
});
