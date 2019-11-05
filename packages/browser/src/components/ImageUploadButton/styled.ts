import styled from 'styled-components';

export const UploadButton = styled('button')`
  width: 100%;
  ${({ theme }) => theme.mixins.button}
  background-color: ${({ theme }) => theme.light};
    color: ${({ theme }) => theme.secondary};
  padding:1rem;
  font-size:1.2rem;
  border-radius:0.5rem;
`;

export default UploadButton;
