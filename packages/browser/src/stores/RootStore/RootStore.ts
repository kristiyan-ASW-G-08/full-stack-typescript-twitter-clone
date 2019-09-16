import { createContext } from 'react';
import { reaction, observable } from 'mobx';
import { create } from 'mobx-persist';
import AuthStore from 'stores/AuthStore/AuthStore';
import ThemeStore from 'stores/ThemeStore/ThemeStore';

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});
export class RootStore {
  @observable public authStore = new AuthStore();
  @observable public themeStore = new ThemeStore();
  public constructor() {
    hydrate('authStore', this.authStore);
    hydrate('themeStore', this.themeStore);
  }
}

const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;
