import ThemeStore from 'stores/ThemeStore/ThemeStore';
describe('ThemeStore', (): void => {
  const themeStore = new ThemeStore();
  it('theme should be light as default', (): void => {
    expect(themeStore.theme).toMatch('light');
  });
  it('toggleTheme should switch between dark and light themes', (): void => {
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('dark');
    themeStore.toggleTheme();
    expect(themeStore.theme).toMatch('light');
  });
});
