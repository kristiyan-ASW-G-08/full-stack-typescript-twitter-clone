import ModalStore from 'stores/ModalStore/ModalStore';
describe('ModalStore', (): void => {
  it('isActive should be false by default, type should be tweetForm by default', (): void => {
    expect.assertions(2);
    const modalStore = new ModalStore();
    expect(modalStore.modalState.isActive).toBeFalsy();
    expect(modalStore.modalState.type).toMatch('tweetForm');
  });
  it('setModalState should change the type and isActive', (): void => {
    expect.assertions(2);
    const modalStore = new ModalStore();
    const type = 'tweetForm';
    modalStore.setModalState(type)
    expect(modalStore.modalState.isActive).toBeTruthy();
    expect(modalStore.modalState.type).toMatch(type);
  });
  it('reset should change isActive and type to their default values', (): void => {
    expect.assertions(1);
    const modalStore = new ModalStore();
    modalStore.modalState.isActive = true;
    modalStore.resetModalState()
    expect(modalStore.modalState.isActive).toBeFalsy();
  });
});
