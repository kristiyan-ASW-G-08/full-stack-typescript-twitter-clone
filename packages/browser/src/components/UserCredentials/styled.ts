import styled from 'styled-components';

export const CredentialsWrapper = styled('div')`
  display: grid;
  grid-gap: 0.7rem;
  grid-template-columns: repeat(1, auto);
  align-items: center;
  justify-items: start;
`;
export const Username = styled('h3')`
  font-size: 1.7rem;
  color: ${({ theme }) => theme.color};
`;

export const Handle = styled('h4')`
  font-size: 1.4rem;
  color: ${({ theme }) => theme.dark};
`;
export const LinksContainer = styled('div')`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-items: start;
  grid-gap: 0.3rem;
  a {
    display: flex;
    flex-flow: row;
    ${({ theme }) => theme.mixins.button};
    font-size: 1.3rem;
    font-weight: bold;
    ${({ theme }) => theme.mixins.button};
    color: ${({ theme }) => theme.secondary};
  }
`;

export default CredentialsWrapper;
