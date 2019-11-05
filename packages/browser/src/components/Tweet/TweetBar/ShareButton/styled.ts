import styled from 'styled-components';

export const ShareButtonWrapper = styled('div')`
  ${({ theme }) => theme.mixins.center}
  position:relative;
`;
export const DropDown = styled('ul')`
  position: absolute;
  transform: translateY(5rem);
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  ${({ theme }) => theme.mixins.border}
  padding:0.5rem;
  width: 10rem;
  list-style: none;
  background: ${({ theme }) => theme.background};
`;

export const DropDownItem = styled('li')`
  width: 100%;
  ${({ theme }) => theme.mixins.center}
  button,a {
    text-align: center;
    display: block;
    text-decoration: none;
    ${({ theme }) => theme.mixins.button}
    background:inherit;
    color: ${({ theme }) => theme.color};
    font-size: 1.2rem;
    width: 100%;
    height: 100%;
    font-weight: bold;
    padding: 0.3rem 0 0.3rem 0;
    :hover {
      color: ${({ theme }) => theme.primary};
    }
  }
`;
