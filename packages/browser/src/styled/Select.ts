import styled from 'styled-components';

export const Select = styled('select')`
  grid-area: select;
  ${({ theme }) => theme.mixins.button};
  ${({ theme }) => theme.mixins.center};
  display: block;
  text-align: center;
  text-align-last: center;
  background: ${({ theme }) =>
    theme.theme === 'light' ? theme.secondary : theme.light};
  color: ${({ theme }) =>
    theme.theme === 'light' ? theme.light : theme.secondary};
  border-radius: 3rem;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 0.3rem 0.5rem 0.3rem 0.5rem;
  appearance: none;
`;

export default Select;
