import styled from 'styled-components';

export const SearchBarWrapper = styled('form')`
  display: grid;
  position: relative;
  grid-gap: 3rem;
  grid-template-columns: auto auto;
  align-content: center;
  justify-items: space-between;
  height: 2.4rem;
  width: 25rem;
  padding: 0 1rem 0 1rem;
  @media only screen and (max-width: 260px) {
    grid-template-columns: 60vw 5vw;
    width: 97vw;
  }
  border-radius: 30px;
  background: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.secondary};
  ${({ theme }) => theme.mixins.border}
  input {
    border: none;
    font-weight: 600;
    font-size: 1.3rem;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.secondary};
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
