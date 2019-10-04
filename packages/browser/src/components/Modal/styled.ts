import styled from 'styled-components';
import { transparentize } from 'polished';

export const ModalWrapper = styled('div')`
  ${props => props.theme.mixins.center}
`;
export const Backdrop = styled('div')`
  position: fixed;
  z-index: 5;
  width: 100vw;
  height: 100vh;
    ${props => props.theme.mixins.center}
  background: ${props => transparentize(0.5, props.theme.secondary)};
`;
