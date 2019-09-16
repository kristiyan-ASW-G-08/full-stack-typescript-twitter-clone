import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

class ThemeStore {
  @persist @observable public theme: 'dark' | 'light' = 'light';
  @action public toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
export default ThemeStore;
