import SidebarStore from 'stores/SidebarStore/SidebarStore';
describe('ThemeStore', (): void => {
  const sibebarStore = new SidebarStore();
  it('theme should be light as default', (): void => {
    expect(sibebarStore.isActive).toBeFalsy();
  });
  it('toggleTheme should switch between true and false', (): void => {
    sibebarStore.toggleIsActive();
    expect(sibebarStore.isActive).toBeTruthy();
    sibebarStore.toggleIsActive();
    expect(sibebarStore.isActive).toBeFalsy();
  });
});
