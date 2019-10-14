import styled from 'styled-components';
import { setLightness } from 'polished';

export const UserItemWrapper = styled('li')`
  a {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 7fr;
    align-items: center;
    padding: 0.5rem;
    background: ${props =>
      props.theme.theme === 'light'
        ?  props.theme.background
        : setLightness(0.3, props.theme.background)};
    color: ${props => props.theme.primary};
    /* ${props => props.theme.mixins.border}; */
  }
`;
