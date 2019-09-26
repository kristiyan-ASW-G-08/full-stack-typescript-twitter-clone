import { observable, action, autorun } from 'mobx';

class ModalStore {
  @observable
  public isActive: boolean = false;
  @observable
  public type: 'tweetForm' = 'tweetForm';
  @action public openModal(type: 'tweetForm'): void {
    this.isActive = true;
    this.type = type;
  }
  @action public reset(): void {
    this.isActive = false;
  }
}
export default ModalStore;
