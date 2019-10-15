import styled from 'styled-components';

export const SearchBarWrapper = styled('form')`
  display: grid;
  position: relative;
  grid-gap: 3rem;
  grid-template-columns: auto auto;
  align-content: center;
  justify-items: space-between;
  height: 2.7rem;
  width: 25rem;
  padding: 0 1rem 0 1rem;
  border-radius: 30px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.secondary};
  ${props => props.theme.mixins.border}
  input {
    border: none;
    font-weight: 600;
    font-size: 1.3rem;
    background: ${props => props.theme.background};
    color: ${props => props.theme.secondary};
  }
  span {
    font-size: 1.3rem;
  }
`;

export const Datalist = styled('ul')`
  position: absolute;
  transform: translateY(4rem);
  list-style: none;
  width: 25rem;
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 0.3rem;
`;
