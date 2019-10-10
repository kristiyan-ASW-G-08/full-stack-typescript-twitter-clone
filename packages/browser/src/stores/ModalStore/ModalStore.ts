import { observable, action, autorun } from 'mobx';
import ModalPayload from 'types/ModalPayload';

class ModalStore {
  @observable
  public isActive: boolean = false;
  @observable
  public type: 'tweetForm' = 'tweetForm';
  @observable
  public payload: ModalPayload = {};
  @action public openModal(type: 'tweetForm', payload?: ModalPayload): void {
    this.isActive = true;
    this.type = type;
    console.log(payload);
    if (payload) {
      this.payload = payload;
    }
  }
  @action public reset(): void {
    console.log('reset');
    this.isActive = false;
  }
}
export default ModalStore;
