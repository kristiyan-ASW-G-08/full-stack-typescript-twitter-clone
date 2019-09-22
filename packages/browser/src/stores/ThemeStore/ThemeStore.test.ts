import ThemeStore from 'stores/ThemeStore/ThemeStore';
describe('ThemeStore', (): void => {
  it('theme should be light as default', (): void => {
    const themeStore = new ThemeStore();
    expect(themeStore.theme).toMatch('light');
  });
  it('toggleTheme should switch between dark and light themes', (): void => {
    const themeStore = new ThemeStore();
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('dark');
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('light');
  });
});
