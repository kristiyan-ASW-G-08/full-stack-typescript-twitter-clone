import { observable, action } from 'mobx';
import ModalState from 'types/ModalState';
import TweetFormProps from 'types/TweetFormProps';
export const defaultModalState: ModalState = {
  isActive: false,
  type: 'tweetForm',
  tweetFormProps: {
    replyId: '',
    retweetedId: '',
  },
};
class ModalStore {
  @observable public modalState: ModalState = defaultModalState;
  @action public setModalState(
    type: 'tweetForm' | 'profileForm',
    tweetFormProps?: TweetFormProps,
  ): void {
    const newModalState: ModalState = {
      isActive: true,
      type,
      tweetFormProps: tweetFormProps
        ? tweetFormProps
        : defaultModalState.tweetFormProps,
    };
    this.modalState = newModalState;
  }
  @action public resetModalState(): void {
    this.modalState = defaultModalState;
  }
}
export default ModalStore;
