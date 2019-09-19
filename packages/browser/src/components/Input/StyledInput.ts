import styled from 'styled-components';
import { lighten } from 'polished';
export const StyledInput = styled('div')`
  input {
    padding: 0.7rem;
    font-size: 1.4rem;
    border: none;
    border-radius: 0.5rem;
    width: 100%;
    background-color: ${props => lighten(0.45, props.theme.secondary)};
  }
  span {
    color: ${props => props.theme.like};
    font-size: 1.3rem;
    font-weight: bold;
  }
`;

export default StyledInput;
