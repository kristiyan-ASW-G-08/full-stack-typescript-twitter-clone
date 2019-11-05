import styled from 'styled-components';

export const ModalWrapper = styled('div')`
  ${({ theme }) => theme.mixins.center}
  overflow: hidden;
`;
export const Backdrop = styled('div')`
  position: fixed;
  z-index: 3;
  width: 100vw;
  min-height:100vh;
  ${({ theme }) => theme.mixins.center}
  background: ${({ theme }) => theme.transparentBackground};
`;
