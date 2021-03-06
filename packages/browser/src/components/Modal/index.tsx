import React, { FC, SyntheticEvent } from 'react';
import { ModalWrapper, Backdrop } from './styled';

interface ModalProps {
  children: JSX.Element | JSX.Element[];
  backdropHandler: () => void;
}
export const Modal: FC<ModalProps> = ({ children, backdropHandler }) => (
  <Backdrop data-testid="backdrop" onClick={backdropHandler}>
    <ModalWrapper onClick={(e: SyntheticEvent) => e.stopPropagation()}>
      {children}
    </ModalWrapper>
  </Backdrop>
);
export default Modal;
