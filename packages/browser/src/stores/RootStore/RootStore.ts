import { create } from 'mobx-persist';
import { createContext } from 'react';
import AuthStore from 'stores/AuthStore/AuthStore';
import { reaction, observable } from 'mobx';

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});
export class RootStore {
  @observable public authStore = new AuthStore();
  public constructor() {
    hydrate('authStore', this.authStore);
  }
}

const RootStoreContext = createContext(new RootStore());
export default RootStoreContext;
