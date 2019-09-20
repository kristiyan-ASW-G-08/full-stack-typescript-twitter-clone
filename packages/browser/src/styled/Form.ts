import styled from 'styled-components';
import { lighten, setLightness } from 'polished';

export const Form = styled('div')`
  display: grid;
  justify-items: center;
  grid-gap: 1.5rem;
  width: 95vw;
  min-height: 25vh;
  padding: 2rem;
  background: ${props => props.theme.background};
  border: solid 1px ${props => setLightness(0.3, props.theme.border)};
  border-radius: 10px;
  @media ${props => props.theme.mediaQueries.tablet} {
    width: 90vw;
  }
  @media ${props => props.theme.mediaQueries.desktop} {
    width: 30vw;
  }
`;
export default Form;
