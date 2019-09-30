import React, { FC, useEffect, SyntheticEvent } from 'react';
import TweetForm from 'components/TweetForm';
import { ModalWrapper, Backdrop } from './styled';
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
      <ModalWrapper onClick={(e: SyntheticEvent) => e.stopPropagation()}>
        {modalComponents[type]}
      </ModalWrapper>
    </Backdrop>
  );
});
export default Modal;
