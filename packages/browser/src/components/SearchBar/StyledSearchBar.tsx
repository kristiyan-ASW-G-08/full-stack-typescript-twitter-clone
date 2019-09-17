import styled from 'styled-components';

export const StyledSearchBar = styled('form')`
  display: grid;
  grid-gap: 3rem;
  grid-template-columns: auto auto;
  align-content: center;
  justify-items: space-between;
  height: 2.7rem;
  width: 24rem;
  padding: 0 1rem 0 1rem;
  border-radius: 30px;
  background: ${props => props.theme.background};
  color: ${props => props.theme.secondary};
  border: solid 1px ${props => props.theme.border};
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
