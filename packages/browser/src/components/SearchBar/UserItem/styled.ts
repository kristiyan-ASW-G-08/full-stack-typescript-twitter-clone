import styled from 'styled-components';

export const UserItemWrapper = styled('li')`
  a {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 1fr 7fr;
    align-items: center;
    padding: 0.5rem;
    background: ${props => props.theme.background};
    color: ${props => props.theme.primary};
    border-radius: 0.3rem;
    ${props => props.theme.mixins.border}
  }
`;
export default UserItemWrapper;
