import { createContext } from 'react';
import { observable } from 'mobx';
import { create } from 'mobx-persist';
import AuthStore from 'stores/AuthStore/AuthStore';
import ThemeStore from 'stores/ThemeStore/ThemeStore';
import SidebarStore from 'stores/SidebarStore/SidebarStore';

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});
export class RootStore {
  @observable public authStore = new AuthStore();
  @observable public themeStore = new ThemeStore();
  @observable public sidebarStore = new SidebarStore();
  public constructor() {
    hydrate('authStore', this.authStore);
    hydrate('themeStore', this.themeStore);
  }
}

const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;
