import styled from 'styled-components';

export const ModalWrapper = styled('div')`
  ${props => props.theme.mixins.center}
  overflow: hidden;
`;
export const Backdrop = styled('div')`
  position: fixed;
  z-index: 3;
  width: 100vw;
  min-height:100vh;
  ${props => props.theme.mixins.center}
  background: ${props => props.theme.transparentBackground};
`;
