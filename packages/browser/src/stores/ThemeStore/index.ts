import { observable, action } from 'mobx';
import { persist } from 'mobx-persist';

type Theme = 'dark' | 'light';

class ThemeStore {
  @persist @observable public theme: Theme = 'light';

  @action public toggleTheme(): void {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
  }
}
export default ThemeStore;
