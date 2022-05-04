import { createContext } from 'react';
import { observable, action } from 'mobx';
import { create } from 'mobx-persist';
import AuthStore from 'stores/AuthStore';
import ThemeStore from 'stores/ThemeStore';
import NotificationStore from 'stores/NotificationStore';

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});
export class RootStore {
  @observable private hydrateUpdate = true;

  @observable public authStore = new AuthStore();

  @observable public themeStore = new ThemeStore();

  @observable public notificationStore = new NotificationStore();

  @action private forceUpdate(): void {
    this.hydrateUpdate = false;
  }

  public constructor() {
    hydrate('authStore', this.authStore);
    hydrate('themeStore', this.themeStore);
  }
}

const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;
