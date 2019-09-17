import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import AuthState from 'types/AuthState';
export const defaultAuthState = {
  isAuth: false,
  user: {
    username: '',
    handle: '',
    email: '',
    website: '',
    profilePhoto: '',
    headerPhoto: '',
    date: '',
    followers: 0,
    following: [],
    likes: [],
    bookmarks: [],
  },
  token: '',
};
class AuthStore {
  @persist('object')
  @observable
  public authState: AuthState = defaultAuthState;
  @action public setAuthState(newAuthState: AuthState): void {
    this.authState = newAuthState;
  }
  @action public resetAuthState(): void {
    this.authState = defaultAuthState;
  }
}
export default AuthStore;
