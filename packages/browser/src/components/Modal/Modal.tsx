import React, { FC, useEffect } from 'react';
import TweetForm from 'components/TweetForm/TweetForm';
import { StyledModal, Backdrop } from './StyledModal';
import { observer } from 'mobx-react-lite';
interface ModalProps {
  type: 'tweetForm';
  resetModalState: () => void;
}
export const Modal: FC<ModalProps> = observer(({ type, resetModalState }) => {
  const modalComponents = {
    tweetForm: <TweetForm />,
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'overflow';
    };
  }, []);
  return (
    <Backdrop onClick={() => resetModalState()}>
      <StyledModal>{modalComponents[type]}</StyledModal>
    </Backdrop>
  );
});
export default Modal;
