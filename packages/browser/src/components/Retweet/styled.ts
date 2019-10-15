import styled from 'styled-components';
import { setLightness } from 'polished';

export const RetweetWrapper = styled('article')`
  width: 100%;
`;

export const RetweetText = styled('div')`
  display: flex;
  flex-flow: row;
  align-content: start;
  font-size: 1.2rem;
  padding: 1rem;
  color: ${props => setLightness(0.4, props.theme.secondary)};
  p {
    margin-left: 0.5rem;
    font-size: 1.3rem;
  }
`;
