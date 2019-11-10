import ThemeStore from 'stores/ThemeStore';

describe('ThemeStore', (): void => {
  it('theme should be light by default', (): void => {
    expect.assertions(1);

    const themeStore = new ThemeStore();

    expect(themeStore.theme).toMatch('light');
  });
  it('toggleTheme should switch theme between dark and light themes', (): void => {
    expect.assertions(2);

    const themeStore = new ThemeStore();

    themeStore.toggleTheme();

    expect(themeStore.theme).toMatch('dark');

    themeStore.toggleTheme();

    expect(themeStore.theme).toMatch('light');
  });
});
