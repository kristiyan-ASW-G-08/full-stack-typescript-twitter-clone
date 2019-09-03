import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';
import AuthState from 'types/AuthState';

class AuthStore {
  @persist('object')
  @observable
  public authState: AuthState | null = null;
  @action public setAuthState(newAuthState: AuthState): void {
    this.authState = newAuthState;
  }
  @action public resetAuthState(): void {
    this.authState = null;
  }
}
export default AuthStore;
