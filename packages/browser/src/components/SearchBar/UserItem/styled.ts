import styled from 'styled-components';

export const UserItemWrapper = styled('li')`
  a {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 7fr;
    align-items: center;
    padding: 0.5rem;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.primary};
    border-radius: 0.3rem;
    ${({ theme }) => theme.mixins.border}
  }
`;
export default UserItemWrapper;
