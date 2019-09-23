import SidebarStore from 'stores/SidebarStore/SidebarStore';
describe('SidebarStore', (): void => {
  const sibebarStore = new SidebarStore();
  it('isActive should be false as default', (): void => {
    expect(sibebarStore.isActive).toBeFalsy();
  });
  it('toggleSidebar should switch between true and false', (): void => {
    sibebarStore.toggleSidebar();
    expect(sibebarStore.isActive).toBeTruthy();
    sibebarStore.toggleSidebar();
    expect(sibebarStore.isActive).toBeFalsy();
  });
});
