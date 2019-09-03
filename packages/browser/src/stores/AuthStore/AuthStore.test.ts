import AuthStore from 'stores/AuthStore/AuthStore';
import AuthState from 'types/AuthState';
describe('AuthStore', (): void => {
  const authStore = new AuthStore();
  const authenticatedAuthState: AuthState = {
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
  it('authState should be null', (): void => {
    expect(authStore.authState).toEqual(null);
  });
  it('authState should be updated with the provided user-data and token', (): void => {
    authStore.setAuthState(authenticatedAuthState);
    expect(authStore.authState).toEqual(authenticatedAuthState);
  });
  it('authState should be null after resetAuthState is called', (): void => {
    authStore.resetAuthState();
    expect(authStore.authState).toEqual(null);
  });
});
