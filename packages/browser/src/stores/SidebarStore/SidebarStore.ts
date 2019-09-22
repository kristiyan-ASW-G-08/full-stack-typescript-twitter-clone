import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

class SidebarStore {
  @persist @observable private isActive: boolean = false;

  public get getActive() {
    return this.isActive;
  }
  @action public toggleIsActive(): void {
    this.isActive = !this.isActive;
  }
}
export default SidebarStore;
