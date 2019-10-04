import React, { FC, useEffect, SyntheticEvent, useContext } from 'react';
import TweetForm from 'components/TweetForm';
import { ModalWrapper, Backdrop } from './styled';
import { observer } from 'mobx-react-lite';
import RootStoreContext from 'stores/RootStore/RootStore';

export const Modal: FC = observer(() => {
  const { modalStore, notificationStore, authStore } = useContext(
    RootStoreContext,
  );
  const modalComponents = {
    tweetForm: (
      <TweetForm
        token={authStore.authState.token}
        resetModalStore={() =>modalStore.reset()}
        setNotification={notificationStore.setNotification}
      />
    ),
  };
  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'overflow';
    };
  }, []);
  return (
    <Backdrop onClick={modalStore.reset}>
      <ModalWrapper onClick={(e: SyntheticEvent) => e.stopPropagation()}>
        {modalComponents[modalStore.type]}
      </ModalWrapper>
    </Backdrop>
  );
});
export default Modal;
