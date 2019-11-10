import { observable, action, autorun } from 'mobx';
import { persist } from 'mobx-persist';
import AuthState from 'types/AuthState';
import User from 'types/User';

export const defaultAuthState = {
  user: undefined,
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

  @action public updateUser(user: User | undefined): void {
    if (user) {
      this.authState.user = user;
    }
  }

  @action public initAuthStoreReset(remainingMilliseconds: number): void {
    autorun(
      () => {
        this.resetAuthState();
      },
      { delay: remainingMilliseconds },
    );
  }
}
export default AuthStore;
