import React, { FC, useEffect, SyntheticEvent, useContext } from 'react';
import TweetForm from 'components/TweetForm';
import { ModalWrapper, Backdrop } from './styled';
import { observer } from 'mobx-react-lite';
import RootStoreContext from 'stores/RootStore/RootStore';

export const Modal: FC = observer(() => {
  const { modalStore, notificationStore, authStore } = useContext(
    RootStoreContext,
  );
  const { modalState } = modalStore;
  const modalComponents = {
    tweetForm: (
      <TweetForm
        tweetFormProps={modalState.tweetFormProps}
        token={authStore.authState.token}
        resetModalState={() => modalStore.resetModalState()}
        setNotification={notificationStore.setNotification}
      />
    ),
    profileForm: () => <div></div>,
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'overflow';
    };
  }, []);
  return (
    <Backdrop onClick={() => modalStore.resetModalState()}>
      <ModalWrapper onClick={(e: SyntheticEvent) => e.stopPropagation()}>
        {modalComponents[modalState.type]}
      </ModalWrapper>
    </Backdrop>
  );
});
export default Modal;
