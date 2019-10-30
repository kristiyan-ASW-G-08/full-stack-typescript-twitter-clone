import styled from 'styled-components';

export const ShareButtonWrapper = styled('div')`
  ${props => props.theme.mixins.center}
  position:relative;
`;
export const DropDown = styled('ul')`
  position: absolute;
  transform: translateY(5rem);
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  ${props => props.theme.mixins.border}
  padding:0.5rem;
  width: 10rem;
  list-style: none;
  background: ${props => props.theme.background};
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
    :hover {
      color: ${props => props.theme.primary};
    }
  }
`;
