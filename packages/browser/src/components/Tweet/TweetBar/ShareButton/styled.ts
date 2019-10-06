import styled from 'styled-components';

import { setLightness } from 'polished';

export const ShareButtonWrapper = styled('div')`
  ${props => props.theme.mixins.center}
`;
export const DropDown = styled('ul')`
  position: fixed;
  transform: translateY(3rem);
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  ${props => props.theme.mixins.border}
  padding:0.5rem;
  width: 10rem;
  list-style: none;
  background: ${props => setLightness(0.2, props.theme.background)};
`;

export const DropDownItem = styled('li')`
  width: 100%;
  ${props => props.theme.mixins.center}
  button,a {
    text-align: center;
    display: block;
    text-decoration: none;
    ${props => props.theme.mixins.button}
    background:inherit;
    color: ${props => props.theme.color};
    font-size: 1.2rem;
    width: 100%;
    height: 100%;
    font-weight: bold;
    padding: 0.3rem 0 0.3rem 0;
  }
`;
