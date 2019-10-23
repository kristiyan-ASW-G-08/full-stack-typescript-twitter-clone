import React, { FC, useEffect, SyntheticEvent, useContext } from 'react';
import { ModalWrapper, Backdrop } from './styled';

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  backdropHandler: () => void;
}
export const Modal: FC<ModalProps> = ({ children, backdropHandler }) => {
  return (
    <Backdrop onClick={backdropHandler}>
      <ModalWrapper onClick={(e: SyntheticEvent) => e.stopPropagation()}>
        {children}
      </ModalWrapper>
    </Backdrop>
  );
};
export default Modal;
