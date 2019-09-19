import styled from 'styled-components';
import { lighten } from 'polished';

export const Form = styled('div')`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 1rem;
  width: 95vw;
  min-height: 25vh;
  padding: 2rem;
  border: solid 1px ${props => lighten(0.4, props.theme.secondary)};
  border-radius: 10px;
`;
export default Form;
