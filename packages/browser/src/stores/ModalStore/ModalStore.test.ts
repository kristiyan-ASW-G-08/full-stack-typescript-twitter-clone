import ModalStore from 'stores/ModalStore/ModalStore';
describe('ModalStore', (): void => {
  it('isActive should be false by default, type should be tweetForm by default', (): void => {
    expect.assertions(2);
    const modalStore = new ModalStore();
    expect(modalStore.isActive).toBeFalsy();
    expect(modalStore.type).toMatch('tweetForm');
  });
  it('openModal should change the type and isActive', (): void => {
    expect.assertions(2);
    const modalStore = new ModalStore();
    const type = 'tweetForm';
    modalStore.openModal(type);
    expect(modalStore.isActive).toBeTruthy();
    expect(modalStore.type).toMatch('tweetForm');
  });
  it('reset should change isActive and type to their default values', (): void => {
    expect.assertions(1);
    const modalStore = new ModalStore();
    modalStore.isActive = true;
    modalStore.reset();
    expect(modalStore.isActive).toBeFalsy();
  });
});
