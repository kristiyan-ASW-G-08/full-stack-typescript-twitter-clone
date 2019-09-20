import styled from 'styled-components';
import { lighten, setLightness } from 'polished';
export const StyledInput = styled('div')`
  width: 100%;
  input {
    padding: 0.7rem;
    font-size: 1.5rem;
    font-weight: bold;
    border: none;
    border-radius: 0.5rem;
    width: 100%;
    background-color: ${props => {
      const color =
        props.theme.currentTheme === 'light'
          ? lighten(0.45, props.theme.secondary)
          : lighten(0.03, props.theme.background);

      return color;
    }};
    color: ${props => props.theme.secondary};
    ::placeholder {
      color: ${props => props.theme.secondary};
    }
  }
  span {
    display: block;
    padding: 1rem 0rem 1rem 1rem;
    color: ${props => props.theme.like};
    font-size: 1.3rem;
    font-weight: bold;
  }
`;

export default StyledInput;
