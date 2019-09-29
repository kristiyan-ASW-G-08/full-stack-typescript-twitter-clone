import styled from 'styled-components';
import { transparentize } from 'polished';

export const StyledModal = styled('div')`
  display: grid;
  align-content: center;
  justify-items: center;
`;
export const Backdrop = styled('div')`
  position: fixed;
  z-index: 5;
  width: 100vw;
  height: 100vh;
  display: grid;
  align-content: center;
  justify-items: center;
  background: ${props => transparentize(0.5, props.theme.secondary)};
`;
