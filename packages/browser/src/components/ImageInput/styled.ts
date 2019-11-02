import styled from 'styled-components';

export const UploadButton = styled('button')`
  width: 100%;
  ${props => props.theme.mixins.button}
  background-color: ${props => props.theme.light};
    color: ${props => props.theme.secondary};
  padding:1rem;
  font-size:1.2rem;
  border-radius:0.5rem;
`;

export default UploadButton;
