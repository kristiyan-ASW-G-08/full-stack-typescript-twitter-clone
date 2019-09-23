import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

class SidebarStore {
  @persist @observable public isActive: boolean = false;
  @action public toggleSidebar(): void {
    this.isActive = !this.isActive;
  }
}
export default SidebarStore;
